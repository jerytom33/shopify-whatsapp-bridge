const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

async function main() {
    console.log('Testing database connection...');
    console.log('URL:', process.env.DATABASE_URL.replace(/:[^:]+@/, ':****@')); // Mask password

    try {
        const userCount = await prisma.user.count();
        console.log('Successfully connected! User count:', userCount);
    } catch (e) {
        console.error('Connection failed:', e.message);
    } finally {
        await prisma.$disconnect();
    }
}

main();
