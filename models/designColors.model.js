const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesignColors = async() => {

    return await prisma.designColors.findMany()

}

// designColorsModel.js
exports.getAllDesignColorsByDesignTypeId = async(DesignTypeId) => {
    return await prisma.designColors.findMany({
        where: {
            DesignType_idDesignType: parseInt(DesignTypeId)  // Ensure DesignTypeId is treated as an integer
        },
        include:{
            DesignColorType:true
        }
    });
}


exports.createDesignColors = async (data) => {

    try{
     const designColor=await prisma.designColors.create({

        data: {
            DesignColorName: data.DesignColorName,
            DesignColorPath: data.DesignColorPath,

            DesignColorType: {
                connect: {
                    idDesignColorType: data.DesignColorType_idDesignColorType
                }
            },

            DesignType: {
                connect: {
                    idDesignType: data.DesignType_idDesignType
                }
            }
        }

    });
    
    return designColor
    }
    catch(error)
    {
        console.log(error);
        return error
    }
   
      
};

exports.updateDesignColors = async (id, data) => {

  return await prisma.designColors.update({

    where: { idDesignColors: parseInt(id) },
    data,
    
  });
};

