const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createOffice = async (data) => {

    try {
      const result =  await prisma.office.create({
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


  const updateOffice = async (data) => {

 const { idoffice, ...updateData } = data;

 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.office.update({
     where: { idoffice },
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

const getAllOffice = async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.office.findMany();
    
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
const getAllOfficeByIdoffice = async (data) => {

  const { idoffice } = data;
 console.log(idoffice);
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.office.findUnique({
      where: { idoffice },
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


module.exports = { createOffice,updateOffice,getAllOffice,getAllOfficeByIdoffice};

