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
  const { idDesignType } = data;

  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.designType.findUnique({
      where: { idDesignType },
      select:{
        DesignColors:true,

        // DesignColorType_has_FormatSizeTexture:true,
        DesignTypeFormatSize:{
          include:{
            FormatSizeTexture:{
              include:{
                DesignColorType_has_FormatSizeTexture:true
              }
            }
          }
        },
        
        
        Design:true,
        MosaicType:{
          select:{
            MosaicTypeValue:true
          },


        }

      }
    });
    
    // Se cierra la conexión a Prisma

    // Se devuelve el resultado exitoso
    return result;
  } catch (e) {
    // En caso de error, se cierra la conexión a Prisma
    console.log(e);
    // Se devuelve el error
    throw e;
  }finally {
    // Siempre desconectar la base de datos después de la operación
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

