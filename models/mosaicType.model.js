const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllMosaicTypes = async() => {

    return await prisma.mosaicType.findMany()

}

exports.createMosaicType = async (data) => {

    return await prisma.mosaicType.create({

        data

    })
      
};

exports.updateMosaicType = async (id, data) => {

  return await prisma.mosaicType.update({

    where: { idMosaicType: parseInt(id) },
    data,
    
  });
};