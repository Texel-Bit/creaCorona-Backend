const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBundleCompanyPrices = async() => {

    return await prisma.bundleCompanyPrice.findMany()

}


exports.getAllBundleCompanyPriceByFormatSizeTexture = async (formatSizeTextureId) => {
  

  return await prisma.bundleCompanyPrice.findMany({
    where: {
      bundle: {
        FormatSizeTexture_idFormatSizeTexture: parseInt(formatSizeTextureId)
      }
    },
    include: {
      companyType: {
        select: {
          companyTypeDescription:true
        }
      },
      companyZone: {
        select: {
          companyZoneName:true
        }
      }
    }
  });
}



exports.createBundleCompanyPrice = async (data) => {

    return await prisma.bundleCompanyPrice.create({

      data,

    })
      
};

exports.createManyBundlesCompanyPrice = async (data) => {

  return await prisma.bundleCompanyPrice.createMany({

    data,

  })
    
};

exports.updateBundleCompanyPrice = async (id, data) => {

  console.log("Id ",id)
  try{
    const newPrice=data.price;
    const companyPrices= await prisma.bundleCompanyPrice.updateMany({
      where: {
        bundle_idbundle: parseInt(id),
        companyZone_idcompanyZone: data.companyZone_idcompanyZone,
        companyType_idcompanyType: data.companyType_idcompanyType,
      },
      data: {
        price: newPrice,
      },
    });

    return companyPrices;
  }
  catch(error)
  {
    console.log(error)
     return error;
  }
 


};

exports.getBundleCompanyPriceByFormatZiseTexture = async (formatSizeTextureId) => {
  try {

    const bundle = await prisma.bundle.findMany({

      where: {

        FormatSizeTexture_idFormatSizeTexture: parseInt(formatSizeTextureId)
      }
    })

    const bundleId = bundle.map((item) => item.idbundle)

    const bundleCompanyPrice = await prisma.bundleCompanyPrice.findMany({

      where: {

        bundle_idbundle: {
          in: bundleId
        }
      }
    })

    return bundleCompanyPrice

  } catch (error) {

    return error
  }
}

exports.getBundleCompanyPrice = async(idBundle, idZone, idCompanyType) => {
  try {

    const companyPrice = await prisma.bundleCompanyPrice.findFirst({

      where: {

        AND: [

          {bundle_idbundle: parseInt(idBundle)},

          {companyZone_idcompanyZone: parseInt(idZone)},

          {companyType_idcompanyType: parseInt(idCompanyType)}
        ]
      }
    })

    return companyPrice

  } catch (error) {

    console.log(error)
    return error

  }
}