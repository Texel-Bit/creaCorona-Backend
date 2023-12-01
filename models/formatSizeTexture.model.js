const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllFormatSizeTexture = async() => {

    return await prisma.formatSizeTexture.findMany({
      
      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.getAllFormatSizeTextureByFormatSizeId = async(formatSizeId) => {

  try
  {
    const textures= await prisma.formatSizeTexture.findMany({
      where:
      {
        DesignTypeFormatSize_idDesignTypeFormatSize: parseInt(formatSizeId)
      }
    })

    return textures;
  }
  catch(error)
  {
    console.log(error)
      return error;
  }


}

exports.createFormatSizeTexture = async (data) => {

  try{
    const formatSizeTexture= await prisma.formatSizeTexture.create({

      data

  })

 


  return formatSizeTexture
  }
  catch(error)
  {
  return error
  }
  
      
};

exports.updateFormatSizeTexture = async (id, data) => {

  try
  {
    const formatSize= await prisma.formatSizeTexture.update({

      where: { idFormatSizeTexture: parseInt(id) },
      data,
      
    });

    return formatSize;
  }

  catch(error)
  {

    return error;
  }
 
};

exports.getDefaultFormatSizeTextureById = async (id) => {


  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.formatSizeTexture.findFirst({

      where: { 
        AND : [

          {isDefault: 1},
          
          {DesignTypeFormatSize_idDesignTypeFormatSize: parseInt(id)}

        ]
       }

    });
 
    console.log(result)
    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (error) {
    console.log(error);
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return error;

  }
 };

exports.getDesignTypeFormatSizeByFormatSizeTextureId = async (id) => {

  try {
    // Actualizar usuario en la base de datos
    const formatSizeTexture = await prisma.formatSizeTexture.findUnique({
      where: { 
        idFormatSizeTexture: parseInt(id) 
      }
    });
    
    const designTypeFormatSizeId = formatSizeTexture.DesignTypeFormatSize_idDesignTypeFormatSize
 
    const designTypeFormatSize = await prisma.designTypeFormatSize.findUnique({

      where: {

        idDesignTypeFormatSize: designTypeFormatSizeId
        
      }
    })

    // Llamar a la función de devolución de llamada con el formatSizeTextureado exitoso
    return designTypeFormatSize;

  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e;

  } 
 };

exports.setFormatSizeTextureStatus = async (id, data) => {
  try {

    const formatSizeTexture = await prisma.FormatSizeTexture.update({

      where: {

        idFormatSizeTexture: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return formatSizeTexture

  } catch (error) {

    console.log(error)
    return error
  }
}

