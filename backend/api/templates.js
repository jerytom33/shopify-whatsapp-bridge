const axios = require('axios');
const prisma = require('../lib/db');
const { decrypt } = require('../utils/encryption');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const userId = req.query.userId || req.body.userId;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        // 1. Get User Config
        const config = await prisma.configuration.findUnique({
            where: { userId }
        });

        if (!config || !config.aocApiKey) {
            return res.status(404).json({ error: 'Configuration not found or API key missing' });
        }

        const apiKey = decrypt(config.aocApiKey);
        if (!apiKey) {
            return res.status(500).json({ error: 'Failed to decrypt API key' });
        }

        // 2. Call AOC Portal API
        // Endpoint: waTemplateList (POST) 
        // Docs suggest POST for listing templates based on previous context
        const response = await axios.post(
            'https://api.aoc-portal.com/v1/whatsapp/waTemplateList',
            {}, // Empty body usually for list all? Or maybe verification is just header
            {
                headers: {
                    'apikey': apiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 10000
            }
        );

        // 3. Transform Response (if needed) or pass through
        // Assumed response format: { status: 'success', data: [...] }
        return res.json({
            success: true,
            data: response.data.data || response.data // Adapt based on actual response
        });

    } catch (error) {
        console.error('Error fetching templates:', error.response?.data || error.message);
        return res.status(500).json({
            error: 'Failed to fetch templates from AOC Portal',
            details: error.response?.data || error.message
        });
    }
};
