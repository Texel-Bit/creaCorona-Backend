const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createState = async (data) => {

    try {
      const result =  await prisma.state.create({
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


  const updateState= async (data) => {

 const { idstate, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.state.update({
     where: { idstate },
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


const getAllState= async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.state.findMany();
    
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




const deleteState= async (data) => {

    const { idstate,  } = data;
   
   
    try {
      // Actualizar usuario en la base de datos\
      const result = await prisma.state.delete({
        where: { idstate },
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


   const getStateByIdState= async (data) => {

    const { idstate } = data;
   
   
    try {
      // Actualizar usuario en la base de datos\
      const result = await prisma.state.findUnique({
        where: { idstate },
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
module.exports = { createState,updateState,getAllState,deleteState,getStateByIdState };

