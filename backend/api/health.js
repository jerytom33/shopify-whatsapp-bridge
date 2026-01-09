const rateLimit = require('express-rate-limit');

// Rate limiter for health checks
const healthLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requests per minute
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = async (req, res) => {
    // Apply rate limiting
    await new Promise((resolve, reject) => {
        healthLimiter(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            resolve(result);
        });
    });

    const healthCheck = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production'
    };

    res.status(200).json(healthCheck);
};
