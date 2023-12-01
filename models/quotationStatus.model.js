const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllQuotationStatus = async() => {

    return await prisma.quotationStatus.findMany()

};

exports.updateQuotationStatus = async(id, data) => {

    return await prisma.quotation.update({

        where: {idquotation: parseInt(id)},

        data
    })
}