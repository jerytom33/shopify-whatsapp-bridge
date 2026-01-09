const prisma = require('../lib/db');

module.exports = async (req, res) => {
    try {
        // Get statistics from database
        // For now, aggregate across all users (can be filtered by userId later)
        const stats = await prisma.statistics.findMany();

        const totalWebhooks = stats.reduce((sum, s) => sum + s.totalWebhooks, 0);
        const successCount = stats.reduce((sum, s) => sum + s.successCount, 0);
        const failureCount = stats.reduce((sum, s) => sum + s.failureCount, 0);
        const retryCount = stats.reduce((sum, s) => sum + s.retryCount, 0);
        const totalProcessingTime = stats.reduce((sum, s) => sum + Number(s.totalProcessingTime), 0);

        const avgProcessingTime = totalWebhooks > 0
            ? Math.round(totalProcessingTime / totalWebhooks)
            : 0;

        const successRate = totalWebhooks > 0
            ? Math.round((successCount / totalWebhooks) * 100)
            : 0;

        // Get recent activity count
        const recentActivityCount = await prisma.webhook.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
                }
            }
        });

        res.json({
            totalWebhooks,
            successCount,
            failureCount,
            retryCount,
            successRate,
            avgProcessingTime,
            recentActivityCount
        });
    } catch (error) {
        console.error('Error fetching stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
};
