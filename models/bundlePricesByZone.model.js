const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBundlePricesByZone = async () => {

    return await prisma.bundle_PricesByZone.findMany()
};

exports.updateBundlePriceByZone = async (id, data) => {
    try {

        const pricesByZone = await prisma.bundle_PricesByZone.update({
    
            where: {bundle_has_companyZonecol: parseInt(id)},
    
            data:{
    
                price: data.price
            }
        })

        console.log(data)
        console.log(pricesByZone)
        
        return pricesByZone

    } catch (error) {

        return error
    }

}

exports.getBundlePriceByZone = async (idZone, idBundle) => {
    console.log(idZone)
    try {
        const prices = await prisma.bundle_PricesByZone.findFirst({

            where: {

                AND: [

                    {bundle_idbundle: parseInt(idBundle)},

                    {companyZone_idcompanyZone: parseInt(idZone)}
                ]
            }
        })


        return prices;

    } catch (error) {
        console.log(error);
        return error;
    }
};

