const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createDesignTypeFormatSize = async (data) => {

    try {
      const result =  await prisma.designTypeFormatSize.create({
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


  const updateDesignTypeFormatSize = async (data) => {

 const { idDesignTypeFormatSize, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.designTypeFormatSize.update({
     where: { idDesignTypeFormatSize },
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

const getAllDesignTypeFormatSize = async () => {
  try {
    // Se llama a Prisma para buscar todos 
    const result = await prisma.designTypeFormatSize.findMany();
    

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

module.exports = { createDesignTypeFormatSize,updateDesignTypeFormatSize,getAllDesignTypeFormatSize };

