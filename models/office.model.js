  const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllOffice = async() => {

    return await prisma.office.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      },

      include: {

        Company: true,
        state: true
      }
    })

}

exports.createOffice = async (data) => {

    return await prisma.office.create({

        data

    })
      
};

exports.updateOffice = async (id, data) => {
try {

  const office = await prisma.office.update({

    where: { idoffice: parseInt(id) },
    data,
    
  });

  console.log(office)
  return office

} catch (error) {

  console.log(error)
  return error
}
};

exports.getAllOfficesByCompanyId = async (id) => {

  try {

    const offices = await prisma.office.findMany({

      where: {Company_idCompany: parseInt(id)},
      include:{
        Company:true,
        state:true
      }
    })

    return offices
  } catch (error) {

    console.log(error)
    return error
  }
}

exports.getAllOfficeStatus = async() => {

  return await prisma.officeStatus.findMany({

  })

}

exports.setOfficeStatus = async (id, data) => {
  try {

    const office = await prisma.office.update({

      where: {

        idoffice: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return office

  } catch (error) {

    console.log(error)
    return error
  }
}