const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createDesignType = async (data) => {

    try {
      const result =  await prisma.designType.create({
        data
      })


  return result
    } catch (e) {
  console.log(e);
  
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };


  const updateDesignType = async (data) => {

 const { idDesignType, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.designType.update({
     where: { idDesignType },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso
   return result
  } catch (e) {
   // Capturar excepción y llamar a la función de devolución de llamada con el error
   return e

 } finally {
   // Siempre desconectar la base de datos después de la operación
   await prisma.$disconnect();
 }
};

const getAllDesignType = async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.designType.findMany();
    
    // Se cierra la conexión a Prisma

    // Se devuelve el resultado exitoso
    return result;
  } catch (e) {
    // En caso de error, se cierra la conexión a Prisma
    
    // Se devuelve el error
    throw e;
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};
const getAllDesignTypeTest = async (data) => {
  const { idDesignType, idEnvironmentType } = data;

  try {
    // Step 1: Fetch matching DesignColorType IDs
    const matchingDesignColorTypes = await prisma.designColorType_has_DesignType.findMany({
      where: {
        EnvironmentType_idEnvironmentType: idEnvironmentType,
        DesignType_idDesignType: idDesignType
      }
    });


    const matchingDesignColorTypeIds = [...new Set(matchingDesignColorTypes.map(item => item.DesignColorType_idDesignColorType))];

    // Step 2: Main query with additional filter for Design
    let result = await prisma.designType.findUnique({
      where: { idDesignType },
      select: {
        DesignColors: true,
        idDesignType: true,
        DesignTypeName: true,
        DesignTypeIconPath: true,
        MosaicType_idMosaicType: true,
        
        DesignTypeFormatSize: {
          where: {
            DesignType_idDesignType: idDesignType,  // Assuming idDesignType is defined
          },
          include: {
            FormatSizeTexture: {
              include: {
                DesignColorType_has_FormatSizeTexture: true
              }
            },
            DesignTypeFormatSize_has_EnvironmentType: {
              where: {
                EnvironmentType_idEnvironmentType: idEnvironmentType,
              }
            }
          }
        },
        Design: {
          where: {
            DesignColorType_idDesignColorType: {
              in: matchingDesignColorTypeIds
            }
          }
        },
        MosaicType: {
          select: {
            MosaicTypeValue: true
          }
        }
      }
    });

    result.DesignTypeFormatSize.forEach(item => {
      item.DesignTypeFormatSizeHeightFixed = item.DesignTypeFormatSizeHeight * item.DesignTypeFormatSizeMosaicScale;
      item.DesignTypeFormatSizeWidhtFixed = item.DesignTypeFormatSizeWidht * item.DesignTypeFormatSizeMosaicScale;
    });

    return result;
  } catch (e) {
    console.log(e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
};




const createDesignColorTypehasDesignType = async (data) => {

  try {
    const result =  await prisma.DesignColorType_has_DesignType.create({
      data
    })


return result
  } catch (e) {
console.log(e);

    return e
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};



const getDesignTypeById = async (data) => {

  const { idDesignType } = data;
 
 
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.designType.findUnique({
      where: { idDesignType },
    });
 
    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    throw e;

  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
 };
module.exports = { createDesignType,updateDesignType,getAllDesignType,getDesignTypeById,getAllDesignTypeTest,createDesignColorTypehasDesignType };

