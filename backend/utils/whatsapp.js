const axios = require('axios');

const AOC_BASE_URL = 'https://api.aoc-portal.com/v1/whatsapp';

/**
 * Sleep utility for retry delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Validate and clean phone number
 */
function validateAndCleanPhone(phone, orderId, logger) {
    if (!phone) {
        if (logger) logger.warn('No phone number found', { orderId });
        return null;
    }

    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // Basic validation: should be between 10-15 digits
    if (cleaned.length < 10 || cleaned.length > 15) {
        if (logger) logger.warn('Invalid phone number length', { orderId, phone, cleaned });
        return null;
    }

    return cleaned;
}

/**
 * Send WhatsApp message with retry logic
 */
async function sendWhatsAppMessageWithRetry(
    to,
    customerName,
    orderId,
    totalPrice,
    currency,
    config,
    logger,
    maxRetries = 3
) {
    const { aocApiKey, senderNumber, templateName } = config;

    const payload = {
        recipient_type: "individual",
        from: senderNumber,
        to: to,
        type: "template",
        template: {
            name: templateName,
            language: { code: "en" },
            components: [
                {
                    type: "body",
                    parameters: [
                        { type: "text", text: customerName },
                        { type: "text", text: orderId },
                        { type: "text", text: `${currency} ${totalPrice}` }
                    ]
                }
            ]
        }
    };

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            const response = await axios.post(AOC_BASE_URL, payload, {
                headers: {
                    'apikey': aocApiKey,
                    'Content-Type': 'application/json'
                },
                timeout: 10000 // 10 second timeout
            });

            if (logger) {
                logger.info('WhatsApp message sent successfully', {
                    to,
                    orderId,
                    attempt: attempt + 1,
                    messageId: response.data.id || response.data.message_id
                });
            }

            return { success: true, data: response.data };

        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s

            const errorDetails = {
                to,
                orderId,
                attempt: attempt + 1,
                maxRetries,
                error: error.message,
                statusCode: error.response?.status,
                responseData: error.response?.data
            };

            if (isLastAttempt) {
                if (logger) {
                    logger.error('Failed to send WhatsApp message after all retries', errorDetails);
                }
                return { success: false, error: errorDetails };
            } else {
                if (logger) {
                    logger.warn('WhatsApp API call failed, retrying...', {
                        ...errorDetails,
                        retryDelay: delay
                    });
                }
                await sleep(delay);
            }
        }
    }
}

module.exports = {
    sendWhatsAppMessageWithRetry,
    validateAndCleanPhone
};
