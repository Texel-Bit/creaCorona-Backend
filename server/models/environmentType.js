const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createEnvironmentType = async (data) => {

  try {
    const result = await prisma.environmentType.create({
      data,
    });

    return result;
  } catch (e) {

    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const createDesignTypeEnvironmentType = async (data) => {
  try {

    if (data.idEnvironmentType) {
      const deleteDesignTypeEnvironmentType = await prisma.designType_EnvironmentType.deleteMany({
    
        where: {
          EnvironmentType_idEnvironmentType: {
            equals: data.DesignType_EnvironmentType,
          },
        }
      });
    }
 
    const result = await prisma.designType_EnvironmentType.createMany({
      data,
    });



    return result;
  } catch (e) {

    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const addDesignColorTypeToEnvironmentType = async (data) => {
  let addedRecords = [];
  try {
    await prisma.$connect();
    
    const { EnvironmentType_idEnvironmentType, Designs } = data;

    
    for (const design of Designs) {
      const { DesignType_idDesignType, DesignColorType_idDesignColorType } = design;

      let existingRecord = null;
    
      for (const colorType of DesignColorType_idDesignColorType) {
        existingRecord = await prisma.DesignColorType_has_DesignType.findFirst({
          where: {
            EnvironmentType_idEnvironmentType,
            DesignType_idDesignType,
            DesignColorType_idDesignColorType: colorType,
          },
        });

        if (existingRecord) continue; // If a record exists, break the loop
      
        const newRecord = await prisma.DesignColorType_has_DesignType.create({
          data: {
            EnvironmentType_idEnvironmentType,
            DesignType_idDesignType,
            DesignColorType_idDesignColorType: colorType,
          },
        });

        
      }

    }

    const allRecords = await prisma.DesignColorType_has_DesignType.findMany({
      where: {
        EnvironmentType_idEnvironmentType,
      },
    });

    return {    
      allRecords,
    };

  } catch (e) {
    console.error(e);
    return e;
  } finally {
    await prisma.$disconnect();
  }
};

const updateEnvironmentType = async (data) => {
  const { idEnvironmentType, ...updateData } = data;

  try {
    // Actualizar usuario en la base de datos\
    const result = await prisma.environmentType.update({
      where: { idEnvironmentType },
      data: updateData,
    });

    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const getAllEnvironmentType = async () => {
  try {
    // Se llama a Prisma para buscar todos
    const result = await prisma.environmentType.findMany({
      include: {
        DesignType_EnvironmentType: {
          select: {
            DesignType_idDesignType: true,
          }
        }
      },
      orderBy: {
        idEnvironmentType: 'desc'  // Add this line for ordering by idEnvironmentType in descending order
      }
    });

    // Se devuelve el resultado exitoso
    return result;
  } catch (e) {
    // En caso de error, se cierra la conexión a Prisma

    // Se devuelve el error
    throw e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};


const getDesignColorTypesByEnvironmentIdAndDesignType = async (environmentTypeId,designType_idDesignType)  => {
  try {
    const designColorTypes = await prisma.designColorType_has_DesignType.findMany({
    where: {
      EnvironmentType_idEnvironmentType: environmentTypeId,
      DesignType_idDesignType:designType_idDesignType
    },
    select: {
      DesignColorType: {
        select: {
          idDesignColorType: true,
          DesignColorTypeDescription: true,
        },
      },
    },
  });

  return designColorTypes.map((item) => item.DesignColorType);
    // Se cierra la conexión a Prisma

  } catch (e) {
    // En caso de error, se cierra la conexión a Prisma

    // Se devuelve el error
    throw e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const getEnvironmentTypeById = async (data) => {
  const { idEnvironmentType } = data;

  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.environmentType.findUnique({
      where: { idEnvironmentType },
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

module.exports = {
  createEnvironmentType,
  updateEnvironmentType,
  getAllEnvironmentType,
  getEnvironmentTypeById,
  createDesignTypeEnvironmentType,
  getDesignColorTypesByEnvironmentIdAndDesignType,
  addDesignColorTypeToEnvironmentType
};
