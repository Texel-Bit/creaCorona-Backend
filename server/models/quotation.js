const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createquotation = async (data) => {

    try {
      const result =  await prisma.quotation.create({
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


  const createQuotationProductDetails = async (data) => {

    try {
        const result = await prisma.quotationProductDetails.createMany({
            data,
          });


  return result
    } catch (e) {

        console.log(e);
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };

  const createDesignColorshasquotation = async (data) => {

    try {
        const result = await prisma.designColors_has_quotation.createMany({
            data,
          });


  return result
    } catch (e) {

        console.log(e);
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };
  const updatequotation = async (data) => {

 const { idquotation, ...updateData } = data;

 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.quotation.update({
     where: { idquotation },
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

const getAllquotation = async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.quotation.findMany();
    
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



module.exports = { createquotation,updatequotation,getAllquotation,createQuotationProductDetails,createDesignColorshasquotation};

