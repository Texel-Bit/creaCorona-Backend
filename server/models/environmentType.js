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

const deleteDesignTypeEnvironmentType = async (data) => {
  try {


      const deleteDesignTypeEnvironmentType = await prisma.designType_EnvironmentType.deleteMany({
    
        where: {
          EnvironmentType_idEnvironmentType: {
            equals: data.EnvironmentType_idEnvironmentType,
          },
          DesignType_idDesignType: {
            equals: data.DesignType_idDesignType,
          },
        }
      });
    
    return deleteDesignTypeEnvironmentType;
  } catch (e) {

    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const addDesignColorTypeToEnvironmentType = async (data) => {

  try {
    await prisma.$connect();
    
    const { EnvironmentType_idEnvironmentType, Designs } = data;

    await prisma.DesignColorType_has_DesignType.deleteMany({
      where: {
        EnvironmentType_idEnvironmentType,
      },
    });

    for (const design of Designs) {
      const { DesignType_idDesignType, DesignColorType_idDesignColorType } = design;

      let existingRecord = null;
    
      for (const colorType of DesignColorType_idDesignColorType) {
      
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


const createDesignTypeFormatSizeForEnvironmentType = async (data) => {
  try {
    await prisma.$connect();

    const { EnvironmentType_idEnvironmentType, DesignTypeFormatSize_idDesignTypeFormatSizeList } = data;

    // Delete existing records
    await prisma.DesignTypeFormatSize_has_EnvironmentType.deleteMany({
      where: {
        EnvironmentType_idEnvironmentType,
      },
    });

    // Create new records
    const createManyData = DesignTypeFormatSize_idDesignTypeFormatSizeList.map(id => ({
      EnvironmentType_idEnvironmentType,
      DesignTypeFormatSize_idDesignTypeFormatSize: id,
    }));

    const newRecords = await prisma.DesignTypeFormatSize_has_EnvironmentType.createMany({
      data: createManyData,
    });

    return {
      message: 'Records updated successfully',
      newRecords,
    };

  } catch (e) {
    console.error(e);
    return e;
  } finally {
    await prisma.$disconnect();
  }
};


const deleteDesignTypeFormatSizeForEnvironmentType = async (data) => {
  try {
    const { EnvironmentType_idEnvironmentType, DesignTypeFormatSize_idDesignTypeFormatSize } = data;

    await prisma.$connect();

    await prisma.DesignTypeFormatSize_has_EnvironmentType.deleteMany({
      where: {
        EnvironmentType_idEnvironmentType,
        DesignTypeFormatSize_idDesignTypeFormatSize

      },
    });

    return {
      message: 'Records deleted successfully',
    };
  } catch (e) {
    console.error(e);
    return e;
  } finally {
    await prisma.$disconnect();
  }
};

const getAllDesignTypeFormatSizeForEnvironmentType = async (EnvironmentType_idEnvironmentType, DesignType_idDesignType) => {
  try {
    await prisma.$connect();

    // Step 1: Fetch the related records based on EnvironmentType_idEnvironmentType
    const records = await prisma.DesignTypeFormatSize_has_EnvironmentType.findMany({
      where: {
        EnvironmentType_idEnvironmentType,
      },
      include: {
        DesignTypeFormatSize: true
      }
    });

    // Step 2: Fetch the DesignTypeFormatSize records based on DesignType_idDesignType
    const designTypeFormatSizeRecords = await prisma.DesignTypeFormatSize.findMany({
      where: {
        DesignType_idDesignType
      }
    });

    // Combine the information.
    const data = records.map(record => ({
      ...record,
      DesignTypeFormatSize: designTypeFormatSizeRecords.find(d => d.idDesignTypeFormatSize === record.DesignTypeFormatSize_idDesignTypeFormatSize)
    })).filter(record => record.DesignTypeFormatSize); // This filters out any records where the DesignTypeFormatSize was not found

    return {
      status: "ok",
      message: 'Records fetched successfully',
      data,
    };

  } catch (e) {
    console.error(e);
    return e;
  } finally {
    await prisma.$disconnect();
  }
};





module.exports = {
  createEnvironmentType,
  updateEnvironmentType,
  getAllEnvironmentType,
  getEnvironmentTypeById,
  createDesignTypeEnvironmentType,
  deleteDesignTypeEnvironmentType,
  getDesignColorTypesByEnvironmentIdAndDesignType,
  addDesignColorTypeToEnvironmentType,
  createDesignTypeFormatSizeForEnvironmentType,
  deleteDesignTypeFormatSizeForEnvironmentType,
  getAllDesignTypeFormatSizeForEnvironmentType
};
