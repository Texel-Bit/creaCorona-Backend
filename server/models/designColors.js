const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createDesignColors = async (data) => {
console.log(data);
    try {
      const result =  await prisma.designColors.create({
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


  const updateDesignColors = async (data) => {

 const { idDesignColors, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos\
   const result = await prisma.designColors.update({
     where: { idDesignColors },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso

   console.log(result);
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


const getAllDesignColors= async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.designColors.findMany(
      {
        orderBy:[{

          DesignColorName:'asc'
        }
        ]
      }
    );
    
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


const getDesignColorsById = async (data) => {

  const { idDesignColors } = data;

  try {

    const result = await prisma.designColors.findUnique({
      where: { idDesignColors },
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

 const getDesignColorsByIdList = async (data) => {

  const arrayColors = data

  let ids = arrayColors.map(color => color.DesignColors_idDesignColors);;

  try {

    const result = await prisma.designColors.findMany({
      where: {
        idDesignColors: {
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
module.exports = { createDesignColors,updateDesignColors,getAllDesignColors,getDesignColorsById,getDesignColorsByIdList };

