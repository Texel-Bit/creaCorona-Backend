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

const getAllState = async () => {
  try {
    await prisma.$connect();

    const allStatesData = await prisma.state.findMany({
      include: {
        companyZone: true, // Include the related companyZone data
      },
      orderBy: {
        stateName: 'asc',
      },
    });

    return allStatesData

  } catch (e) {
    console.error(e);
    return {
      status: "error",
      message: "An error occurred while fetching all states",
      data: null,
    };
  } finally {
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
    const idstateInt = parseInt(idstate, 10);
   
    console.log("idstateInt ",idstateInt);

    try {
      // Actualizar usuario en la base de datos\
      const result = await prisma.state.findUnique({
        where: { idstate:idstateInt },
      });
       
      console.log("Result ",result);
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

