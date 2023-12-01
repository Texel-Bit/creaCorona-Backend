const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllStates = async() => {

    return await prisma.state.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      },

      include: {

        companyZone: {

          select:{

            companyZoneName: true
          }
        }
      }
    })

}

exports.createState = async (data) => {

    return await prisma.state.create({

        data

    })
      
};

exports.updateState = async (id, data) => {

  return await prisma.state.update({

    where: { idstate: parseInt(id) },
    data,
    
  });
};

exports.deleteState = async (id) => {

    return await prisma.state.delete({

      where: { idstate: parseInt(id) },

    });
  };

exports.getStateByOfficeId = async(id) => {
    try {
  
      const office = await prisma.office.findUnique({

        where: {idoffice: parseInt(id)}

      })

      const statesIds = office.state_idstate;

      const state = await prisma.state.findUnique({

        where: {

          idstate:  statesIds
          
        }
      })

      return state

    } catch (error) {

      return error
    }
}

exports.setStateStatus = async (id, data) => {
  try {

    const state = await prisma.state.update({

      where: {

        idstate: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return state

  } catch (error) {

    console.log(error)
    return error
  }
}