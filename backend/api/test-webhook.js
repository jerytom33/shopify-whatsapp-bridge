const prisma = require('../lib/db');
const { sendWhatsAppMessageWithRetry, validateAndCleanPhone } = require('../utils/whatsapp');
const { decrypt } = require('../utils/encryption');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { orderId, customerName, phone, totalPrice, currency, userId } = req.body;

    if (!orderId || !customerName || !phone || !totalPrice || !currency) {
        return res.status(400).json({
            error: 'Missing required fields',
            required: ['orderId', 'customerName', 'phone', 'totalPrice', 'currency']
        });
    }

    const cleanedPhone = validateAndCleanPhone(phone, orderId, console);
    if (!cleanedPhone) {
        return res.status(400).json({ error: 'Invalid phone number format' });
    }

    try {
        // Get user configuration (default to first user if not specified)
        let config;
        if (userId) {
            config = await prisma.configuration.findUnique({
                where: { userId }
            });
        } else {
            // Fallback: get first active configuration
            config = await prisma.configuration.findFirst({
                where: { isActive: true }
            });
        }

        if (!config) {
            return res.status(400).json({ error: 'No active configuration found. Please configure your settings first.' });
        }

        // Decrypt API keys
        const aocApiKey = decrypt(config.aocApiKey);
        const senderNumber = config.senderNumber;
        const templateName = config.templateName;

        const startTime = Date.now();
        const result = await sendWhatsAppMessageWithRetry(
            cleanedPhone,
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
                userId: config.userId,
                orderId,
                customerName,
                phone: cleanedPhone,
                status: result.success ? 'success' : 'failed',
                processingTime,
                totalPrice: `${currency} ${totalPrice}`,
                error: result.error ? JSON.stringify(result.error) : null,
                isTest: true
            }
        });

        // Update statistics
        await prisma.statistics.upsert({
            where: { userId: config.userId },
            update: {
                totalWebhooks: { increment: 1 },
                successCount: result.success ? { increment: 1 } : undefined,
                failureCount: !result.success ? { increment: 1 } : undefined,
                totalProcessingTime: { increment: processingTime }
            },
            create: {
                userId: config.userId,
                totalWebhooks: 1,
                successCount: result.success ? 1 : 0,
                failureCount: result.success ? 0 : 1,
                retryCount: 0,
                totalProcessingTime: processingTime
            }
        });

        res.json({
            success: result.success,
            processingTime,
            data: result.data,
            error: result.error
        });
    } catch (error) {
        console.error('Test webhook failed:', error);
        res.status(500).json({ error: error.message });
    }
};
