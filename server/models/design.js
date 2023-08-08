const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createDesign = async (data) => {

    try {
      const result =  await prisma.design.create({
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


  const updateDesign= async (data) => {

 const { idDesign, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.design.update({
     where: { idDesign },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso
   return result
  } catch (e) {

  console.log(e);
   // Capturar excepción y llamar a la función de devolución de llamada con el error
   return e
  } finally {
   // Siempre desconectar la base de datos después de la operación
   await prisma.$disconnect();
 }
};


const getAllDesign= async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.design.findMany();
    
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
const getDesignById = async (idDesign) => {
 
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.design.findUnique({
      where: { idDesign },
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

 const getDesignByIdList = async (data) => {

  const designList = data

  let ids = designList.map(color => color.Design_idDesign);;


  try {

    const result = await prisma.Design.findMany({
      where: {
        idDesign: {
          in: ids
        }
      }
    });

    return result;
  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    throw e;

  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
 };


module.exports = { createDesign,updateDesign,getAllDesign,getDesignById,getDesignByIdList };

