const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const createDesignColorInBundle = async (data) => {
  try {
    const result = await prisma.designColorInBundle.create({
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



const deleteDesignColorInBundle = async (data) => {
  const { idDesignColorInBundle } = data;

  try {
    // Actualizar usuario en la base de datos\
    const result = await prisma.DesignColorInBundle.delete({
      where: { idDesignColorInBundle },
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


module.exports = {
  createDesignColorInBundle,
  deleteDesignColorInBundle,
};
