const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDesignColorBundle = async (data) => {
  try {
    const result = await prisma.designColorBundle.create({
      data,
    });

    return result;
  } catch (e) {
    console.log(e);
    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const updateDesignColorBundle = async (data) => {
  const { idDesignColorBundle, ...updateData } = data;

  try {
    // Actualizar usuario en la base de datos\
    const result = await prisma.designColorBundle.update({
      where: { idDesignColorBundle },
      data: updateData,
    });

    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (e) {
    console.log(e);
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

const getAllDesignColorBundle = async () => {
  try {
    // Se llama a Prisma para buscar todos las compañias
    const result = await prisma.designColorBundle.findMany({
      select: {
        idDesignColorBundle: true,
        DesignColorBundleName: true,
        DesignColorInBundle: {
          select: {
            DesignColors: true,
          },
        },
      },
    });

    // Se cierra la conexión a Prisma

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

const deleteDesignColorBundle = async (data) => {
  const { idDesignColorBundle } = data;

  try {
    // Actualizar usuario en la base de datos\
    const result = await prisma.designColorBundle.delete({
      where: { idDesignColorBundle },
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

const getAllDesignColorBundleByFilters = async (data) => {
  const {
    idDesignColorBundle,
    idDesignType,
    idDesignColorType,
    idEnvironmentType,
  } = data;

  try {
    // Actualizar usuario en la base de datos\
    const result = await prisma.designColorBundle.findMany({
      where: {
        AND: [
          {
            DesignType_idDesignType: {
              equals: idDesignType, // args.id => 770
            },
          },
          {
            DesignColorType_idDesignColorType: {
              equals:idDesignColorType, // userId => 1
            },
          },
          {
            EnvironmentType_idEnvironmentType: {
              equals: idEnvironmentType, // userId => 1
            },
          },
        ],
      },

      select: {
        idDesignColorBundle: true,
        DesignColorBundleName: true,
        DesignColorInBundle: {
          select: {
            DesignColors: true,
          },
        },
      },
    });

    // Llamar a la función de devolución de llamada con el resultado exitoso
    return result;
  } catch (e) {
    console.log(e);
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};
module.exports = {
  getAllDesignColorBundleByFilters,
  createDesignColorBundle,
  updateDesignColorBundle,
  getAllDesignColorBundle,
  deleteDesignColorBundle,
};
