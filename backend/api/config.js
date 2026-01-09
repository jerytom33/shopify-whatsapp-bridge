const prisma = require('../lib/db');
const { encrypt, decrypt } = require('../utils/encryption');

module.exports = async (req, res) => {
    const userId = req.query.userId || req.body.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const config = await prisma.configuration.findUnique({
                where: { userId }
            });

            if (!config) {
                return res.json({ found: false });
            }

            // Return decrypted/masked config
            return res.json({
                found: true,
                shopifyStoreName: config.shopifyStoreName,
                senderNumber: config.senderNumber,
                templateName: config.templateName,
                isActive: config.isActive,
                // Don't return secrets in plain text, maybe just a connection status or partial?
                // For simplicity in this dashboard, we'll return empty for secrets on GET 
                // and only update them if provided on POST
                hasShopifySecret: !!config.shopifyWebhookSecret,
                hasAocApiKey: !!config.aocApiKey
            });
        } catch (error) {
            console.error('Error fetching config:', error);
            return res.status(500).json({ error: 'Failed to fetch configuration' });
        }
    }

    else if (req.method === 'POST') {
        try {
            const {
                shopifyWebhookSecret,
                shopifyStoreName,
                aocApiKey,
                senderNumber,
                templateName
            } = req.body;

            // Check if user exists, if not create
            let user = await prisma.user.findUnique({ where: { id: userId } });
            if (!user) {
                // Create a dummy user since we don't have real auth yet
                user = await prisma.user.create({
                    data: {
                        id: userId,
                        email: `${userId}@example.com`,
                        password: 'placeholder-hash', // In a real app, this would be hashed
                        name: 'Demo User'
                    }
                });
            }

            const dataToUpdate = {
                shopifyStoreName,
                senderNumber,
                templateName,
                isActive: true
            };

            if (shopifyWebhookSecret) {
                dataToUpdate.shopifyWebhookSecret = encrypt(shopifyWebhookSecret);
            }
            if (aocApiKey) {
                dataToUpdate.aocApiKey = encrypt(aocApiKey);
            }

            const config = await prisma.configuration.upsert({
                where: { userId },
                update: dataToUpdate,
                create: {
                    userId,
                    ...dataToUpdate,
                    // Require secrets on create
                    shopifyWebhookSecret: dataToUpdate.shopifyWebhookSecret || '',
                    aocApiKey: dataToUpdate.aocApiKey || ''
                }
            });

            return res.json({ success: true, message: 'Configuration saved' });

        } catch (error) {
            console.error('Error saving config:', error);
            return res.status(500).json({ error: 'Failed to save configuration' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
};
