require('dotenv').config();
const express = require('express');
const axios = require('axios');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// --- CONFIGURATION ---
const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;
const AOC_API_KEY = process.env.AOC_API_KEY;
const AOC_BASE_URL = 'https://api.aoc-portal.com/v1/whatsapp';
const SENDER_NUMBER = process.env.SENDER_NUMBER;
const WHATSAPP_TEMPLATE_NAME = process.env.WHATSAPP_TEMPLATE_NAME || 'order_confirmation';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';
const ENABLE_CORS = process.env.ENABLE_CORS === 'true';

// --- ACTIVITY STORE (In-Memory) ---
const MAX_ACTIVITIES = 100;
const activityLog = [];
const statistics = {
    totalWebhooks: 0,
    successCount: 0,
    failureCount: 0,
    retryCount: 0,
    totalProcessingTime: 0,
    startTime: new Date().toISOString()
};

// --- LOGGER SETUP ---
const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'shopify-whatsapp-bridge' },
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
                    return `${timestamp} [${level}]: ${message} ${metaStr}`;
                })
            )
        })
    ]
});

// --- RATE LIMITING ---
const webhookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
        logger.warn('Rate limit exceeded', { ip: req.ip, path: req.path });
        res.status(429).json({ error: 'Too many requests' });
    }
});

const healthLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute for health checks
    standardHeaders: true,
    legacyHeaders: false
});

// --- MIDDLEWARE ---
// CORS
if (ENABLE_CORS) {
    app.use(cors({
        origin: FRONTEND_URL,
        credentials: true
    }));
    logger.info('CORS enabled', { allowedOrigin: FRONTEND_URL });
}

app.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));

// --- HELPER: VERIFY SHOPIFY WEBHOOK ---
function verifyShopifyWebhook(req) {
    try {
        const hmac = req.headers['x-shopify-hmac-sha256'];
        if (!hmac) {
            logger.warn('Missing HMAC header');
            return false;
        }

        if (!SHOPIFY_SECRET) {
            logger.error('SHOPIFY_WEBHOOK_SECRET not configured');
            return false;
        }

        const genHash = crypto
            .createHmac('sha256', SHOPIFY_SECRET)
            .update(req.rawBody, 'utf8')
            .digest('base64');

        return hmac === genHash;
    } catch (error) {
        logger.error('HMAC verification error', { error: error.message });
        return false;
    }
}

// --- HELPER: SLEEP FOR RETRY ---
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// --- HELPER: SEND WHATSAPP MESSAGE WITH RETRY ---
async function sendWhatsAppMessageWithRetry(to, customerName, orderId, totalPrice, currency, maxRetries = 3) {
    const payload = {
        recipient_type: "individual",
        from: SENDER_NUMBER,
        to: to,
        type: "template",
        template: {
            name: WHATSAPP_TEMPLATE_NAME,
            language: { code: "en" },
            components: [
                {
                    type: "body",
                    parameters: [
                        { type: "text", text: customerName },
                        { type: "text", text: orderId },
                        { type: "text", text: `${currency} ${totalPrice}` }
                    ]
                }
            ]
        }
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post(AOC_BASE_URL, payload, {
                headers: {
                    'apikey': AOC_API_KEY,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });

            logger.info('WhatsApp message sent successfully', {
                to,
                orderId,
                attempt: attempt + 1,
                messageId: response.data.id || response.data.message_id
            });

            return { success: true, data: response.data };

        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s

            const errorDetails = {
                to,
                orderId,
                attempt: attempt + 1,
                maxRetries,
                error: error.message,
                statusCode: error.response?.status,
                responseData: error.response?.data
            };

            if (isLastAttempt) {
                logger.error('Failed to send WhatsApp message after all retries', errorDetails);
                return { success: false, error: errorDetails };
            } else {
                logger.warn('WhatsApp API call failed, retrying...', {
                    ...errorDetails,
                    retryDelay: delay
                });
                await sleep(delay);
            }
        }
    }
}

// --- HELPER: VALIDATE PHONE NUMBER ---
function validateAndCleanPhone(phone, orderId) {
    if (!phone) {
        logger.warn('No phone number found', { orderId });
        return null;
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Basic validation: should be between 10-15 digits
    if (cleaned.length < 10 || cleaned.length > 15) {
        logger.warn('Invalid phone number length', { orderId, phone, cleaned });
        return null;
    }

    return cleaned;
}

// --- HELPER: ADD TO ACTIVITY LOG ---
function addActivity(activity) {
    activityLog.unshift({
        id: Date.now() + Math.random(),
        timestamp: new Date().toISOString(),
        ...activity
    });

    // Keep only last MAX_ACTIVITIES
    if (activityLog.length > MAX_ACTIVITIES) {
        activityLog.pop();
    }
}

// --- ROUTE: HEALTH CHECK ---
app.get('/health', healthLimiter, (req, res) => {
    const uptime = process.uptime();
    const healthCheck = {
        status: 'healthy',
        uptime: Math.floor(uptime),
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: NODE_ENV
    };

    logger.debug('Health check requested', { uptime });
    res.status(200).json(healthCheck);
});

// --- API: GET STATISTICS ---
app.get('/api/stats', (req, res) => {
    const uptime = process.uptime();
    const avgProcessingTime = statistics.totalWebhooks > 0
        ? Math.round(statistics.totalProcessingTime / statistics.totalWebhooks)
        : 0;

    const successRate = statistics.totalWebhooks > 0
        ? Math.round((statistics.successCount / statistics.totalWebhooks) * 100)
        : 0;

    res.json({
        totalWebhooks: statistics.totalWebhooks,
        successCount: statistics.successCount,
        failureCount: statistics.failureCount,
        retryCount: statistics.retryCount,
        successRate,
        avgProcessingTime,
        uptime: Math.floor(uptime),
        startTime: statistics.startTime,
        recentActivityCount: activityLog.length
    });
});

// --- API: GET ACTIVITY LOG ---
app.get('/api/activity', (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const offset = parseInt(req.query.offset) || 0;

    const paginatedActivities = activityLog.slice(offset, offset + limit);

    res.json({
        activities: paginatedActivities,
        total: activityLog.length,
        limit,
        offset
    });
});

// --- API: TEST WEBHOOK ---
app.post('/api/test-webhook', async (req, res) => {
    const { orderId, customerName, phone, totalPrice, currency } = req.body;

    if (!orderId || !customerName || !phone || !totalPrice || !currency) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['orderId', 'customerName', 'phone', 'totalPrice', 'currency']
        });
    }

    const cleanedPhone = validateAndCleanPhone(phone, orderId);
    if (!cleanedPhone) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
        const startTime = Date.now();
        const result = await sendWhatsAppMessageWithRetry(
            cleanedPhone,
            customerName,
            orderId,
            totalPrice,
            currency
        );
        const processingTime = Date.now() - startTime;

        // Track in activity log
        addActivity({
            orderId,
            customerName,
            phone: cleanedPhone,
            status: result.success ? 'success' : 'failed',
            processingTime,
            error: result.error ? result.error.error : null,
            isTest: true
        });

        if (result.success) {
            statistics.successCount++;
        } else {
            statistics.failureCount++;
        }
        statistics.totalWebhooks++;
        statistics.totalProcessingTime += processingTime;

        res.json({
            success: result.success,
            processingTime,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        logger.error('Test webhook failed', { error: error.message });
        res.status(500).json({ error: error.message });
    }
});

// --- ROUTE: SHOPIFY ORDER WEBHOOK ---
app.post('/webhooks/orders/create', webhookLimiter, async (req, res) => {
    const startTime = Date.now();

    try {
        // 1. Security Check
        if (!verifyShopifyWebhook(req)) {
            logger.error('Unauthorized webhook request', {
                ip: req.ip,
                headers: req.headers
            });
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // 2. Validate Configuration
        if (!AOC_API_KEY || !SENDER_NUMBER || !WHATSAPP_TEMPLATE_NAME) {
            logger.error('Missing required environment variables', {
                hasApiKey: !!AOC_API_KEY,
                hasSenderNumber: !!SENDER_NUMBER,
                hasTemplateName: !!WHATSAPP_TEMPLATE_NAME
            });
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // 3. Extract Data from Shopify Payload
        const order = req.body;
        const orderId = order.name || 'Unknown';
        const customerName = order.customer?.first_name || 'Customer';
        const totalPrice = order.total_price || '0.00';
        const currency = order.currency || 'USD';

        logger.info('Shopify order received', {
            orderId,
            customerName,
            totalPrice,
            currency
        });

        // 4. Extract and Clean Phone Number
        let phone = order.shipping_address?.phone || order.customer?.phone;
        phone = validateAndCleanPhone(phone, orderId);

        if (!phone) {
            logger.warn('Order processed but no valid phone number', { orderId });
            return res.status(200).json({
                status: 'processed',
                message: 'No valid phone number found'
            });
        }

        // 5. Send WhatsApp Message with Retry
        const result = await sendWhatsAppMessageWithRetry(
            phone,
            customerName,
            orderId,
            totalPrice,
            currency
        );

        const processingTime = Date.now() - startTime;

        // Track statistics and activity
        statistics.totalWebhooks++;
        statistics.totalProcessingTime += processingTime;

        if (result.success) {
            statistics.successCount++;

            addActivity({
                orderId,
                customerName,
                phone,
                status: 'success',
                processingTime,
                totalPrice: `${currency} ${totalPrice}`
            });

            logger.info('Webhook processed successfully', {
                orderId,
                processingTime,
                messageId: result.data.id || result.data.message_id
            });

            return res.status(200).json({
                status: 'success',
                orderId,
                processingTime
            });
        } else {
            statistics.failureCount++;
            statistics.retryCount++;

            addActivity({
                orderId,
                customerName,
                phone,
                status: 'failed',
                processingTime,
                totalPrice: `${currency} ${totalPrice}`,
                error: result.error ? result.error.error : 'Unknown error'
            });

            logger.error('Webhook processed but message failed', {
                orderId,
                processingTime,
                error: result.error
            });

            return res.status(200).json({
                status: 'processed',
                message: 'Order received but notification failed',
                orderId
            });
        }

    } catch (error) {
        const processingTime = Date.now() - startTime;
        logger.error('Unexpected error processing webhook', {
            error: error.message,
            stack: error.stack,
            processingTime
        });

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

// --- 404 HANDLER ---
app.use((req, res) => {
    logger.warn('404 Not Found', { path: req.path, method: req.method });
    res.status(404).json({ error: 'Not Found' });
});

// --- START SERVER ---
const server = app.listen(PORT, () => {
    logger.info('Server started', {
        port: PORT,
        environment: NODE_ENV,
        logLevel: LOG_LEVEL,
        webhookUrl: `/webhooks/orders/create`,
        healthUrl: `/health`
    });
});

// --- GRACEFUL SHUTDOWN ---
const gracefulShutdown = (signal) => {
    logger.info(`${signal} received, starting graceful shutdown`);

    server.close(() => {
        logger.info('Server closed, all connections terminated');
        process.exit(0);
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
        logger.error('Forcing shutdown after timeout');
        process.exit(1);
    }, 30000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// --- UNHANDLED ERRORS ---
process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
    gracefulShutdown('uncaughtException');
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection', { reason, promise });
});
