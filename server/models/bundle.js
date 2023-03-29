const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createBundle = async (data) => {

    try {
      const result =  await prisma.bundle.create({
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



module.exports = { createBundle,updateBundle,getAllBundle };

