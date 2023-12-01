const { error } = require('@hapi/joi/lib/base');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllQuotation = async() => {

    return await prisma.quotation.findMany({
        include: {
            sysUser: {
                select: {
                    userName: true,
                    lastName: true,
                    office: {
                        select: {
                            officeDescription: true,
                            Company: {
                                select: {
                                    CompanyName: true
                                }
                            }
                        }
                    }
                }
            },
            DesignColors_has_quotation: {
                include: {
                  DesignColors: {
                    select: {
                      DesignColorName: true,
                      DesignColorPath: true
                    }
                  }
                }
              }
        }
    });
    

}

exports.updateQuotationStatus = async (id, data) => {
    try {

        const quotationStatus = await prisma.quotation.update({
    
            where: {idquotation: parseInt(id)},
    
            data: {
    
                quotationStatus_idquotationStatus: data.quotationStatus_idquotationStatus 
            }
        })

        console.log(quotationStatus)
        console.log(data)
        return quotationStatus

    } catch (error) {

        return error
    }
}

exports.createQuotation = async (data) => {
    try {

        const quotation = await prisma.quotation.create({

            data
        })

        return quotation

    } catch (error) {

        console.log(error)

        return error
    }
}