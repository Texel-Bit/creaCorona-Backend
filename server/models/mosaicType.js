const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getAllMosaicType= async () => {
    try {
      // Se llama a Prisma para buscar todos las compañias
      const result = await prisma.mosaicType.findMany();
      
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
module.exports = { getAllMosaicType };
