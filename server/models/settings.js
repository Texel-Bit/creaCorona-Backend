const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getCurrentSettings = async () => {
    try {

      const result = await prisma.SystemSetup.findMany();
      
  
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

  
  module.exports = { getCurrentSettings};
