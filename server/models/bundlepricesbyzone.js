const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getBundlePriceByZone = async (data) => {
  const { idBundle, companyZone_idcompanyZone } = data;
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.bundle_PricesByZone.findFirst({
      where: { bundle_idbundle: idBundle ,
        companyZone_idcompanyZone:companyZone_idcompanyZone },
    });

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
module.exports = { getBundlePriceByZone };
