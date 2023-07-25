const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getBundlePriceByZone = async (data) => {
  const { idBundle, companyZone_idcompanyZone } = data;
  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.bundle_PricesByZone.findMany({
      where: { AND: { bundle_idbundle: { equals: idBundle },companyZone_idcompanyZone:{equals:companyZone_idcompanyZone} } },
    });
console.log(result);
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
