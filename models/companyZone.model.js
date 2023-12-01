const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCompanyZones = async() => {

    return await prisma.companyZone.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.getAllCompanyStatus = async() => {

  return await prisma.companyStatus.findMany()

}


exports.createCompanyZone = async (data) => {

    return await prisma.companyZone.create({

      data,

    })
      
};

exports.updateCompanyZone = async (id, data) => {

  return await prisma.companyZone.update({

    where: { idcompanyZone: parseInt(id) },
    data,
    
  });
};

exports.setCompanyZoneStatus = async (id, data) => {
  try {

    const companyZone = await prisma.companyZone.update({

      where: {

        idcompanyZone: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return companyZone

  } catch (error) {

    console.log(error)
    return error
  }
}

