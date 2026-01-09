const crypto = require('crypto');

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY || '12345678901234567890123456789012', 'utf8');
const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt sensitive data before storing in database
 */
function encrypt(text) {
    if (!text) return '';

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return iv.toString('hex') + ':' + encrypted;
}

/**
 * Decrypt sensitive data from database
 */
function decrypt(text) {
    if (!text) return '';

    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];

        const decipher = crypto.createDecipheriv(ALGORITHM, ENCRYPTION_KEY, iv);

        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('Decryption error:', error.message);
        return '';
    }
}

/**
 * Mask API key for display (show only last 4 characters)
 */
function maskApiKey(key) {
    if (!key || key.length < 8) return '****';
    return '****' + key.slice(-4);
}

module.exports = {
    encrypt,
    decrypt,
    maskApiKey
};
