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
    const result = await prisma.environmentType.findMany();

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
  createDesignTypeEnvironmentType
};
