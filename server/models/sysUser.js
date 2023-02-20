const sql = require("./db.js");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const createUser = async (data, resultado) => {
  try {
    const result = await prisma.sysUser.create({
      data,
    });
    await prisma.$disconnect();
    delete result.password
delete result.tempPassword
delete result.tempPasswordExpDate
    resultado(null, { result });
  } catch (e) {

    console.log(e);
    await prisma.$disconnect();

    resultado(e, null);
  }
};

const findOneLoginByEmail = async ({ email }, resultado) => {


  try {
    const result = await prisma.sysUser.findMany({
      where: {
               
            email: {
                equals: email,
            },
            
      },
    });
    await prisma.$disconnect();

    resultado(null,  result );
  } catch (e) {
    await prisma.$disconnect();

    resultado(e, null);
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
    await prisma.$disconnect();

    resultado(null,  result );
  } catch (e) {

    console.log(e);
    await prisma.$disconnect();

    resultado(e, null);
  }
};


const changePassword = async ({ idsysuser, password }, resultado) => {

  try {
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
    await prisma.$disconnect();
console.log(result);
    resultado(null,  result );
  } catch (e) {

    console.log(e);
    await prisma.$disconnect();

    resultado(e, null);
  }
};

const getAllUsers = async (resultado) => {

  try {
    const result = await prisma.sysUser.findMany({
    
      
    });
    await prisma.$disconnect();
console.log(result);
    resultado(null,  result );
  } catch (e) {

    console.log(e);
    await prisma.$disconnect();

    resultado(e, null);
  }
};

const updateStatusByIdUser = async (data, resultado) => {


let idsysuser=data.idsysuser;
delete data.idsysuser
  try {
    const result = await prisma.sysUser.update({
      where: {
        idsysuser
     },
      data
      
    });
    await prisma.$disconnect();
    resultado(null,  result );
  } catch (e) {

    console.log(e);
    await prisma.$disconnect();

    resultado(e, null);
  }
};




module.exports = { createUser, findOneLoginByEmail,recoverPassword,changePassword,getAllUsers,updateStatusByIdUser };
