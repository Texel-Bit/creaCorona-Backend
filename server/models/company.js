const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createCompany = async (data) => {

    try {
      const result =  await prisma.company.create({
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


  const updateCompany = async (data,resultado) => {

 const { idCompany, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.company.update({
     where: { idCompany },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso
   resultado(null, result);
 } catch (e) {
   // Capturar excepción y llamar a la función de devolución de llamada con el error
   console.log(e);
   resultado(e, null);
 } finally {
   // Siempre desconectar la base de datos después de la operación
   await prisma.$disconnect();
 }
};


const getAllCompany= async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.company.findMany();
    
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
module.exports = { createCompany,updateCompany,getAllCompany };

