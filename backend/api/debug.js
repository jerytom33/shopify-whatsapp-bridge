const prisma = require('../lib/db');

module.exports = async (req, res) => {
    try {
        const envStatus = {
            NODE_ENV: process.env.NODE_ENV,
            DATABASE_URL_EXISTS: !!process.env.DATABASE_URL,
            DIRECT_URL_EXISTS: !!process.env.DIRECT_URL,
            ENCRYPTION_KEY_EXISTS: !!process.env.ENCRYPTION_KEY,
            ENCRYPTION_KEY_LENGTH: process.env.ENCRYPTION_KEY ? process.env.ENCRYPTION_KEY.length : 0
        };

        // Attempt a simple database connection
        const count = await prisma.user.count();

        res.status(200).json({
            status: 'ok',
            message: 'Database connection successful',
            params: envStatus,
            userCount: count
        });

    } catch (error) {
        // Return error details as JSON instead of crashing
        res.status(200).json({
            status: 'error',
            message: error.message,
            stack: error.stack,
            name: error.name,
            params: {
                NODE_ENV: process.env.NODE_ENV,
                DATABASE_URL_EXISTS: !!process.env.DATABASE_URL
            }
        });
    }
};
