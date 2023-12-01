const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesignColorBundles = async() => {

    return await prisma.designColorBundle.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.createDesignColorBundle = async (data) => {

    return await prisma.designColorBundle.create({

        data

    })
      
};

exports.updateDesignColorBundle = async (id, data) => {

  return await prisma.designColorBundle.update({

    where: { idDesignColorBundle: parseInt(id) },
    data,
    
  });
};

exports.deleteDesignColorBundle = async (id) => {

    return await prisma.DesignColorBundle.delete({

      where: { idDesignColorBundle: parseInt(id) },

    });
  };

  exports.getAllDesignColorBundleByFilters = async (DesignType_idDesignType, DesignColorType_idDesignColorType, EnvironmentType_idEnvironmentType) => {
    
    console.log(DesignType_idDesignType, DesignColorType_idDesignColorType, EnvironmentType_idEnvironmentType)
    try {
      const designColorBundle = await prisma.designColorBundle.findMany({
        where: {
          AND: [
            {
              DesignType_idDesignType: DesignType_idDesignType
            },
            {
              DesignColorType_idDesignColorType: DesignColorType_idDesignColorType
            },
            {
              EnvironmentType_idEnvironmentType: EnvironmentType_idEnvironmentType
            }
          ]
        },

        include: {

          DesignColorInBundle: {


            

            include: {

              DesignColors: true
            }
          }

        }
      });

      console.log(designColorBundle);

      return designColorBundle;
    } catch (error) {
      throw new Error('Error fetching DesignColorTypes: ' + error.message);
    }
  };
  
  
