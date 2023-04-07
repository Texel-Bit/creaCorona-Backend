// const sql = require("./db.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (data) => {
  try {
    const result = await prisma.sysUser.create({
      data,
    });
    await prisma.$disconnect();
    delete result.password
delete result.tempPassword
delete result.tempPasswordExpDate
return result
  } catch (e) {


    return e
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

// Esta función recibe un objeto que contiene un email y retorna una promesa con el resultado
const findOneLoginByEmail = async ({ email }) => {
  try {
    // Realizamos una búsqueda en la tabla sysUser de la base de datos con el email proporcionado
    const result = await prisma.sysUser.findMany({
      where: {
        email: {
          equals: email,
        },
      },
    });

    // Devolvemos el resultado de la búsqueda
    return result
  } catch (e) {

    return e
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};



const recoverPassword = async ({ email, tempPassword,tempPasswordExpDate }, resultado) => {

  try {
    const result = await prisma.sysUser.updateMany({
      where: {
         email: {
          equals: email,
      },
     },
      data: {
        tempPassword,
        tempPasswordExpDate,
        password:'********'
      },
      
    });

    return result;
  } catch (e) {


    resultado(e, null);
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};


const changePassword = async ({ idsysuser, password }, resultado) => {

  try {
    // Llamada a Prisma para actualizar la contraseña del usuario
    const result = await prisma.sysUser.updateMany({
      where: {
        idsysuser
     },
      data: {
        password,
        tempPasswordExpDate:null,
        tempPassword:null
      },
      
    });

    // Se devuelve el resultado exitoso
return result  } catch (e) {

    // Se devuelve el error
    return e
  }finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};


// Función asincrónica que obtiene todos los usuarios de la base de datos
const getAllUsers = async () => {
  try {
    // Se llama a Prisma para buscar todos los usuarios
    const result = await prisma.sysUser.findMany();
    
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

const updateUser = async (data, resultado) => {
  // Extraer idsysuser de data
  const { idsysuser, ...updateData } = data;

  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.sysUser.update({
      where: { idsysuser },
      data: updateData
    });

    // Llamar a la función de devolución de llamada con el resultado exitoso
    resultado(null, result);
  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    console.log(e);
    resultado(e, null);
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};


const updateUserStatus = async (data, resultado) => {
  // Extraer idsysuser de data
  const { idsysuser, ...updateData } = data;


  try {
    // Actualizar usuario en la base de datos
    const result = await prisma.sysUser.update({
      where: { idsysuser },
      data: updateData
    });

    // Llamar a la función de devolución de llamada con el resultado exitoso
    resultado(null, result);
  } catch (e) {
    // Capturar excepción y llamar a la función de devolución de llamada con el error
    console.log(e);
    resultado(e, null);
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};





module.exports = { createUser, findOneLoginByEmail,recoverPassword,changePassword,getAllUsers,updateUser,updateUserStatus };
