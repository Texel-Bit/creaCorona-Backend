const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();


const createBundleCompanyPrice = async (data) => {

    try {
      const result =  await prisma.bundleCompanyPrice.create({
        data
      })

  return result
    } catch (e) {
  
      return e
    }finally {
      // Siempre desconectar la base de datos después de la operación
      await prisma.$disconnect();
    }
  };


  const updateBundleCompanyPrice = async (data,resultado) => {

 const { idbundleCompanyPrice, ...updateData } = data;


 try {
   // Actualizar usuario en la base de datos
   const result = await prisma.bundleCompanyPrice.update({
     where: { idbundleCompanyPrice },
     data: updateData
   });

   // Llamar a la función de devolución de llamada con el resultado exitoso
   return result
 } catch (e) {
   // Capturar excepción y llamar a la función de devolución de llamada con el error
   return e
 } finally {
   // Siempre desconectar la base de datos después de la operación
   await prisma.$disconnect();
 }
};

const getAllBundleCompanyPrice = async () => {
  try {
    // Se llama a Prisma para buscar todos los usuarios
    const result = await prisma.bundleCompanyPrice.findMany();
    
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


const getBundleCompanyPriceByBundleCompanyTypeComopanyZone = async (data) => {

  const { idbundle,idcompanyZone,idcompanyType } = data;
  try {
    const result = await prisma.bundleCompanyPrice.findFirst({
      where: {
        bundle_idbundle:idbundle,
        companyZone_idcompanyZone:idcompanyZone,
        companyType_idcompanyType:idcompanyType,
        
      },
    });
    
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


module.exports = { createBundleCompanyPrice,updateBundleCompanyPrice,getAllBundleCompanyPrice,getBundleCompanyPriceByBundleCompanyTypeComopanyZone };

