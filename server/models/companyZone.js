const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createCompanyZone = async (data) => {

    try {
      const result =  await prisma.companyZone.create({
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


  const updateCompanyZone = async (data,resultado) => {

 const { idcompanyZone, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.companyZone.update({
     where: { idcompanyZone },
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

const getAllCompanyZone = async () => {
  try {
    // Se llama a Prisma para buscar todos los usuarios
    const result = await prisma.companyZone.findMany();
    
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




module.exports = { createCompanyZone,updateCompanyZone,getAllCompanyZone };

