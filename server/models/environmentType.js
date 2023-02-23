const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createEnvironmentType = async (data) => {

    try {
      const result =  await prisma.environmentType.create({
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


  const updateEnvironmentType= async (data,resultado) => {

 const { idEnvironmentType, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.environmentType.update({
     where: { idEnvironmentType },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso
   resultado(null, result);
 } catch (e) {

  console.log(e);
   // Capturar excepción y llamar a la función de devolución de llamada con el error
   resultado(e, null);
 } finally {
   // Siempre desconectar la base de datos después de la operación
   await prisma.$disconnect();
 }
};

module.exports = { createEnvironmentType,updateEnvironmentType };

