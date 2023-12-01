const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCompanys = async() => {

    return await prisma.company.findMany({

      include: {

        companyStatus: true,
        companyType: true,
        CompanyRole: true
      },

      where: {
        companyStatus_idcompanyStatus: 1
      }
    })

}

exports.getAllCompanyRole = async() => {

  return await prisma.companyRole.findMany({

  });

}

exports.createCompany = async (data) => {

    return await prisma.company.create({

      data,

    })
      
};

exports.updateCompany = async (id, data) => {

  return await prisma.company.update({

    where: { idCompany: parseInt(id) },
    data,
    
  });
};

exports.getCompanyByOfficeId = async (id) => {
  try {

    const office = await prisma.office.findUnique({

      where: {idoffice: parseInt(id)}
    })

    const companyId = office.Company_idCompany

    const company = await prisma.company.findUnique({

      where: {
        idCompany: companyId
      }
    })

    return company
  
  } catch (error) {

    console.log(error)
    return error

  }
}