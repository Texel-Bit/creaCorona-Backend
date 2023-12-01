const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

exports.getAllDesignCompany = async() => {

    return await prisma.designCompany.findMany()

}

exports.createDesignCompany = async (data) => {

    return await prisma.designCompany.create({

        data

    })
      
};

exports.updateDesignCompany = async (Company_idCompany, Design_idDesign, data) => {
  try {
    console.log("texto", data);
    const updatedDesignCompany = await prisma.designCompany.update({
      data: {

        DesignCompanyBuyPrice: data,
      },

      where: {

        Company_idCompany_Design_idDesign: {

          Company_idCompany: Company_idCompany,

          Design_idDesign: Design_idDesign
        }
      }
    });
    
    return updatedDesignCompany;

  } catch (error) {

    console.error('Original Error:', error);
    throw new Error('Error updating DesignCompany: ' + error.message);
    
  }
};
