const configHandler = require('./api/config.js');
const prisma = require('./lib/db');

// Mock Request and Response
const req = {
    method: 'POST',
    body: {
        userId: 'testuser_debug_1',
        webhookSecret: '9d4096316e890450070eb445159100ff89d2a074d68a80463976080cd843850a',
        storeName: 'Debug Store',
        aocApiKey: 'oGMHVie2dQj8e4nt7Jzm3zQOcyEcV6',
        senderNumber: '917736761562',
        templateName: 'order_confirmation'
    },
    query: {}
};

const res = {
    setHeader: (k, v) => console.log(`Header: ${k}=${v}`),
    status: (code) => {
        console.log(`Status: ${code}`);
        return res;
    },
    json: (data) => {
        console.log('Response:', JSON.stringify(data, null, 2));
    }
};

async function main() {
    try {
        console.log("Simulating Config Save...");
        await configHandler(req, res);
    } catch (e) {
        console.error("Handler threw uncaught error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
