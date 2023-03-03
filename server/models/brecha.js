const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createBrecha = async (data) => {

    try {
      const result =  await prisma.brecha.create({
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


  const updateBrecha = async (data,resultado) => {

 const { idbrecha, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.brecha.update({
     where: { idbrecha },
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

const getAllBrecha = async () => {
  try {
    // Se llama a Prisma para buscar todos los usuarios
    const result = await prisma.brecha.findMany();
    
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
const getBrechaById = async (data) => {

  const { idbrecha } = data;
 
  try {
    const result = await prisma.brecha.findUnique({
      where: { idbrecha },
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

module.exports = { createBrecha,updateBrecha,getAllBrecha,getBrechaById };

