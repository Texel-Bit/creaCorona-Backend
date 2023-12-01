const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


exports.getAllDesignColorType = async() => {

    return await prisma.designColorType.findMany()

}

exports.createDesignColorTypehasDesignType = async (data) => {

    try {

      const designColorTypeHasDesignType = await prisma.designColorType_has_DesignType.create({

        data

    })

      console.log(designColorTypeHasDesignType)
      return designColorTypeHasDesignType
    } catch (error) {

      throw new Error('Error fetching DesignColorTypes: ' + error.message);

    }
      
};

exports.getAllDesignColorTypehasDesignType = async () => {

    return await prisma.designColorType_has_DesignType.findMany()
      
};

exports.deleteDesignColorTypehasDesignType = async (EnvironmentType_idEnvironmentType, DesignType_idDesignType, DesignColorType_idDesignColorType) => {

  try {

    const designColorTypeHasDesignType = await prisma.designColorType_has_DesignType.deleteMany({

      where: {
        AND: [

          {EnvironmentType_idEnvironmentType},

          {DesignType_idDesignType},

          {DesignColorType_idDesignColorType}
        ]
      }
    })

    return designColorTypeHasDesignType

  } catch (error) {

    throw new Error('Error fetching DesignColorTypes: ' + error.message);

  }
};

exports.getDesignColorTypeByDesignType = async (designType_idDesignType) => {
  try {

    const designColorType_has_DesignType = await prisma.DesignColorType_has_DesignType.findMany({

      where: {
        DesignType_idDesignType: designType_idDesignType,
      },
    });

    console.log(designColorType_has_DesignType)

    const designColorTypeIds = designColorType_has_DesignType.map((item) => item.DesignColorType_idDesignColorType);
    console.log (designColorTypeIds);

    const designColorTypes = await prisma.DesignColorType.findMany({

      where: {

        idDesignColorType: {
          in: designColorTypeIds
        },
      },
    });
    
    console.log(designColorTypes)

    return designColorTypes;
  } catch (error) {
    throw new Error('Error fetching DesignColorTypes: ' + error.message);
  }
};


