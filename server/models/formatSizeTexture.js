const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createFormatSizeTexture = async (data) => {

    try {
      const result =  await prisma.formatSizeTexture.create({
        data
      })

  return result
    } catch (e) {
  
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };


  const updateFormatSizeTexture= async (data) => {

 const { idFormatSizeTexture, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.formatSizeTexture.update({
     where: { idFormatSizeTexture },
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


const getAllFormatSizeTexture = async () => {
  try {
    // Se llama a Prisma para buscar todos 
    const result = await prisma.formatSizeTexture.findMany();
    
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


const getFormatSizeTextureById = async (data) => {

  const { idFormatSizeTexture } = data;
 
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.formatSizeTexture.findUnique({
      where: { idFormatSizeTexture },
      include:{
        DesignTypeFormatSize:true
      }
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

 const getDefaultFormatSizeTextureById = async (data) => {


  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.formatSizeTexture.findFirst({
      where: { DesignTypeFormatSize_idDesignTypeFormatSize:+data,
        FormatSizeTextureName:'Plano'
       },
       select: {
        idFormatSizeTexture: true
      }
    });
 
    console.log(result)
    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (e) {
    console.log(e);
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    throw e;

  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
 };

module.exports = { createFormatSizeTexture,updateFormatSizeTexture,getAllFormatSizeTexture,getFormatSizeTextureById,getDefaultFormatSizeTextureById };

