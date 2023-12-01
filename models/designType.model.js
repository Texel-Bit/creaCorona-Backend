const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesignType = async() => {

    return await prisma.designType.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      },

      include: {

        MosaicType: true
      }
    })

}

exports.createDesignType = async (data) => {

    return await prisma.designType.create({

        data

    })
      
};

exports.updateDesignType = async (id, data) => {

  return await prisma.designType.update({

    where: { idDesignType: parseInt(id) },
    data,
    
  });
};

exports.getDesignsByEnvironmentType = async (data) => {

  try {

    
    
  } catch (error) {

    return error
  } 
};

exports.setDesignTypeStatus = async (id, data) => {
  try {

    const designType = await prisma.DesignType.update({

      where: {

        idDesignType: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return designType

  } catch (error) {

    console.log(error)
    return error
  }
}
