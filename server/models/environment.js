const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createEnvironment = async (data) => {


  console.log(data);
    try {
      const result =  await prisma.environment.create({
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


  const updateEnvironment= async (data,resultado) => {

 const { idEnvironment, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.environment.update({
     where: { idEnvironment },
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


const getAllEnvironment = async () => {
  try {
    // Se llama a Prisma para buscar todos 
    const result = await prisma.environment.findMany();
    
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

const getEnvironmentById = async (data) => {

  const { idEnvironment } = data;
 
 
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.environment.findUnique({
      where: { idEnvironment },
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

module.exports = { createEnvironment,updateEnvironment,getAllEnvironment,getEnvironmentById };

