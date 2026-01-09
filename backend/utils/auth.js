const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-change-in-production';

/**
 * Hash password before storing
 */
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

/**
 * Verify password on login
 */
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Generate JWT token
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Verify JWT token
 */
function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Middleware to protect routes
 */
function authMiddleware(req, res, next) {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }

    req.user = decoded;
    next();
}

module.exports = {
    hashPassword,
    verifyPassword,
    generateToken,
    verifyToken,
    authMiddleware
};
