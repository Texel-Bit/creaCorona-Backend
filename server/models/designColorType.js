const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const getAllDesignColorType= async () => {
    try {
      // Se llama a Prisma para buscar todos las compañias
      const result = await prisma.DesignColorType.findMany();
      
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

  const createDesignColorTypehasDesignType = async (data) => {

    try {
      const result =  await prisma.designColorType_has_DesignType.createMany({
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

  const deleteDesignColorTypehasDesignType = async (data) => {
console.log(data);
    try {
      const result =  await prisma.designColorType_has_DesignType.deleteMany({
        where:{
          
         
          AND:{
            DesignType_idDesignType:{
              equals:data.DesignType_idDesignType
            },
            DesignColorType_idEnvironmentType:{
              equals:data.DesignColorTypeidEnvironmentType
            },
            DesignColorType_IdDesignColorType:{
              equals:data.DesignColorTypeIdDesignColorType
            }

          }

        }
      })

      console.log(result);

  return result
    } catch (e) {
      console.log(e);
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };
module.exports = { getAllDesignColorType,createDesignColorTypehasDesignType,deleteDesignColorTypehasDesignType };
