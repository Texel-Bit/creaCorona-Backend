// session.model.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSession = async () => {
    return await prisma.session.create({
        data: {
            sessionStartDate: new Date(),
        },
    });
};

exports.closeSession = async (sessionId) => {
    return await prisma.session.update({
        where: { idsession: sessionId },
        data: {
            sessionEndDate: new Date(),
        },
    });
};
