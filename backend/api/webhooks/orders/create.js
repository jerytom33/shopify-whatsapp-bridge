const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const prisma = require('../../lib/db');
const { sendWhatsAppMessageWithRetry, validateAndCleanPhone } = require('../../utils/whatsapp');
const { decrypt } = require('../../utils/encryption');

// Rate limiter for webhooks
const webhookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Verify Shopify webhook signature
function verifyShopifyWebhook(req, shopifySecret) {
    try {
        const hmac = req.headers['x-shopify-hmac-sha256'];
        if (!hmac) {
            console.warn('Missing HMAC header');
            return false;
        }

        if (!shopifySecret) {
            console.error('SHOPIFY_WEBHOOK_SECRET not configured');
            return false;
        }

        const genHash = crypto
            .createHmac('sha256', shopifySecret)
            .update(req.rawBody || JSON.stringify(req.body), 'utf8')
            .digest('base64');

        return hmac === genHash;
    } catch (error) {
        console.error('HMAC verification error:', error.message);
        return false;
    }
}

module.exports = async (req, res) => {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
        webhookLimiter(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            resolve(result);
        });
    });

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const startTime = Date.now();

    try {
        // Extract userId from URL path (format: /api/webhooks/orders/create?userId=xxx or from body)
        const userId = req.query.userId || req.body.userId;

        if (!userId) {
            console.error('Missing userId in webhook request');
            return res.status(400).json({ error: 'Missing userId parameter' });
        }

        // Get user configuration
        const config = await prisma.configuration.findUnique({
            where: { userId },
            include: { user: true }
        });

        if (!config || !config.isActive) {
            console.error('No active configuration found for user:', userId);
            return res.status(404).json({ error: 'Configuration not found or inactive' });
        }

        // Decrypt Shopify secret for verification
        const shopifySecret = decrypt(config.shopifyWebhookSecret);

        // Verify webhook signature
        if (!verifyShopifyWebhook(req, shopifySecret)) {
            console.error('Unauthorized webhook request', {
                ip: req.headers['x-forwarded-for'] || req.connection?.remoteAddress,
                userId
            });
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Extract data from Shopify payload
        const order = req.body;
        const orderId = order.name || 'Unknown';
        const customerName = order.customer?.first_name || 'Customer';
        const totalPrice = order.total_price || '0.00';
        const currency = order.currency || 'USD';

        console.log('Shopify order received:', {
            orderId,
            customerName,
            totalPrice,
            currency,
            userId
        });

        // Extract and clean phone number
        let phone = order.shipping_address?.phone || order.customer?.phone;
        phone = validateAndCleanPhone(phone, orderId, console);

        if (!phone) {
            console.warn('Order processed but no valid phone number:', orderId);
            return res.status(200).json({
                status: 'processed',
                message: 'No valid phone number found'
            });
        }

        // Decrypt API keys
        const aocApiKey = decrypt(config.aocApiKey);
        const senderNumber = config.senderNumber;
        const templateName = config.templateName;

        // Send WhatsApp message with retry
        const result = await sendWhatsAppMessageWithRetry(
            phone,
            customerName,
            orderId,
            totalPrice,
            currency,
            { aocApiKey, senderNumber, templateName },
            console
        );

        const processingTime = Date.now() - startTime;

        // Save to database
        await prisma.webhook.create({
            data: {
                userId,
                orderId,
                customerName,
                phone,
                status: result.success ? 'success' : 'failed',
                processingTime,
                totalPrice: `${currency} ${totalPrice}`,
                error: result.error ? JSON.stringify(result.error) : null,
                isTest: false
            }
        });

        // Update statistics
        await prisma.statistics.upsert({
            where: { userId },
            update: {
                totalWebhooks: { increment: 1 },
                successCount: result.success ? { increment: 1 } : undefined,
                failureCount: !result.success ? { increment: 1 } : undefined,
                retryCount: !result.success ? { increment: 1 } : undefined,
                totalProcessingTime: { increment: processingTime }
            },
            create: {
                userId,
                totalWebhooks: 1,
                successCount: result.success ? 1 : 0,
                failureCount: result.success ? 0 : 1,
                retryCount: result.success ? 0 : 1,
                totalProcessingTime: processingTime
            }
        });

        if (result.success) {
            console.log('Webhook processed successfully:', {
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
            console.error('Webhook processed but message failed:', {
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
        console.error('Unexpected error processing webhook:', {
            error: error.message,
            stack: error.stack,
            processingTime
        });

        return res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
};
