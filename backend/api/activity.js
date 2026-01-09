const prisma = require('../lib/db');

module.exports = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const offset = parseInt(req.query.offset) || 0;

        // Fetch webhooks from database with pagination
        const webhooks = await prisma.webhook.findMany({
            take: limit,
            skip: offset,
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                orderId: true,
                customerName: true,
                phone: true,
                status: true,
                processingTime: true,
                totalPrice: true,
                error: true,
                isTest: true,
                createdAt: true
            }
        });

        const total = await prisma.webhook.count();

        res.json({
            activities: webhooks.map(w => ({
                id: w.id,
                orderId: w.orderId,
                customerName: w.customerName,
                phone: w.phone,
                status: w.status,
                processingTime: w.processingTime,
                totalPrice: w.totalPrice,
                error: w.error,
                isTest: w.isTest,
                timestamp: w.createdAt.toISOString()
            })),
            total,
            limit,
            offset
        });
    } catch (error) {
        console.error('Error fetching activity:', error);
        res.status(500).json({ error: 'Failed to fetch activity log' });
    }
};
