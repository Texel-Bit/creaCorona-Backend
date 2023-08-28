const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createBundle = async (data) => {

  console.log(data,"Datisss ")
    try {
      const result =  await prisma.bundle.create({
        data
      })


  return result
    } catch (e) {
      console.log(e)
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };


  const updateBundle = async (data) => {

 const { idbundle, ...updateData } = data;

 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.bundle.update({
     where: { idbundle },
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

const getAllBundle = async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.bundle.findMany();
    
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


const getBundleDesignDataByBundleId = async (data) => {

  

  const { idbundle } = data;
 
  

  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.$queryRaw`SELECT DISTINCT DesignType.DesignTypeName, DesignTypeFormatSize.DesignTypeFormatSizeName,FormatSizeTexture.FormatSizeTextureName, bundle.* FROM bundle,FormatSizeTexture,DesignTypeFormatSize,DesignType WHERE
    DesignTypeFormatSize.idDesignTypeFormatSize= FormatSizeTexture.DesignTypeFormatSize_idDesignTypeFormatSize
    AND bundle.FormatSizeTexture_idFormatSizeTexture=FormatSizeTexture.idFormatSizeTexture AND DesignType.idDesignType=DesignTypeFormatSize.DesignType_idDesignType
     AND bundle.idbundle=${idbundle}`
    ;

    console.log(result);
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

const getBundleDesignTypeFormatSizeTexture = async (data) => {

  const { idFormatSizeTexture, ...updateData } = data;
 
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.bundle.findFirst({
      where: {FormatSizeTexture_idFormatSizeTexture:{
        equals:idFormatSizeTexture
      } },
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



module.exports = { createBundle,updateBundle,getAllBundle,getBundleDesignTypeFormatSizeTexture,getBundleDesignDataByBundleId };

