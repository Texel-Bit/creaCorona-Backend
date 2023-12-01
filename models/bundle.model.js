const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllBundles = async() => {

    return await prisma.bundle.findMany()

}

exports.createBundle = async (data) => {

  try{
    const bundle= await prisma.bundle.create({

      data

  })

  return bundle;

  }
  catch(error)
  {
    console.log(error);
    return error;
  }
   
    
      
};

exports.updateBundle = async (id, data) => {

  return await prisma.bundle.update({

    where: { idbundle: parseInt(id) },
    data,
    
  });
};

exports.getBundleDesignDataByBundleId = async (data) => {

  

  const { idbundle } = data;
 
  

  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.$queryRaw`SELECT DISTINCT DesignType.DesignTypeName, DesignTypeFormatSize.DesignTypeFormatSizeName,FormatSizeTexture.FormatSizeTextureName, bundle.* FROM bundle,FormatSizeTexture,DesignTypeFormatSize,DesignType WHERE
    DesignTypeFormatSize.idDesignTypeFormatSize= FormatSizeTexture.DesignTypeFormatSize_idDesignTypeFormatSize
    AND bundle.FormatSizeTexture_idFormatSizeTexture=FormatSizeTexture.idFormatSizeTexture AND DesignType.idDesignType=DesignTypeFormatSize.DesignType_idDesignType
     AND bundle.idbundle=${idbundle}`
    ;

    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result
   } catch (e) {

    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e
 
  } 
 };

exports.getBundleDesignTypeFormatSizeTexture = async (id) => { 
  try {

    const result = await prisma.bundle.findFirst({

      where: {FormatSizeTexture_idFormatSizeTexture: parseInt(id)},

    });
 
    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result

   } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e
 
  } 
 };