const axios = require('axios');

async function testConfig() {
    const payload = {
        userId: 'test-script-user',
        shopifyWebhookSecret: 'secret_123',
        shopifyStoreName: 'Test Script Store',
        aocApiKey: 'key_123',
        senderNumber: '15551234567',
        templateName: 'order_confirmation'
    };

    try {
        console.log('Sending payload:', payload);
        const res = await axios.post('http://localhost:3000/api/config', payload);
        console.log('Success:', res.status, res.data);
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testConfig();
