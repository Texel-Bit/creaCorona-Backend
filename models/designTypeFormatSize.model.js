const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesignTypeFormatSize = async() => {

    return await prisma.designTypeFormatSize.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.getAllDesignTypeByDesignTypeId = async(DesignTypeId) => {
  return await prisma.designTypeFormatSize.findMany({
      where: {
          DesignType_idDesignType: parseInt(DesignTypeId) // parsing to ensure it's treated as an integer
      }
  });
}



exports.createDesignTypeFormatSize = async (data) => {

  try{
    const newFormat= await prisma.designTypeFormatSize.create({

      data

  })

  return newFormat;
  }
  catch(error)
  {
    console.log(error)
    return error
  }
   
      
};

exports.updateDesignTypeFormatSize = async (id, data) => {

  console.log()
  try{
    const formatSize= await prisma.designTypeFormatSize.update({

      where: { idDesignTypeFormatSize: parseInt(id) },
      data,
      
    });

    return formatSize;
  }
  catch(error)
  {
    console.log(error)
    return error;
  } 
  
};

exports.setDesignTypeFormatSizeStatus = async (id, data) => {
  try {

    const designTypeFormatSize = await prisma.DesignTypeFormatSize.update({

      where: {

        idDesignTypeFormatSize: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return designTypeFormatSize

  } catch (error) {

    console.log(error)
    return error
  }
}

exports.getDesignTypeFormatSizByEnvironmentTypeId = async (id) => {
  try {

    const designFormatHasEnvironmentType = await prisma.designTypeFormatSize_has_EnvironmentType.findMany({

      where: {EnvironmentType_idEnvironmentType: parseInt(id)}
    })

    const formatSizeIds = designFormatHasEnvironmentType.map((element) => element.DesignTypeFormatSize_idDesignTypeFormatSize)

    const designTypeFormatSize = await prisma.designTypeFormatSize.findMany({

      where: {

        idDesignTypeFormatSize: {

          in: formatSizeIds
        }
      },

      include: {

        FormatSizeTexture:{

          include: {

            DesignColorType_has_FormatSizeTexture: true
            
          }
        },
        
      }
    })

    return designTypeFormatSize

  } catch (error) {

    return error
  }
}