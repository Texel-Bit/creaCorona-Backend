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


  const updateDesign= async (data,resultado) => {

 const { idDesign, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.design.update({
     where: { idDesign },
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

module.exports = { createDesign,updateDesign };

