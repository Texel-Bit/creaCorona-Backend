const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getCurrentSettings = async () => {

    return await prisma.systemSetup.findMany()
}