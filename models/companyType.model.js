const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCompanyTypes = async() => {

    return await prisma.companyType.findMany()

}

exports.createCompanyType = async (data) => {

    return await prisma.companyType.create({

      data,

    })
      
};

exports.updateCompanyType = async (id, data) => {

  return await prisma.companyType.update({

    where: { idcompanyType: parseInt(id) },
    data,
    
  });
};

