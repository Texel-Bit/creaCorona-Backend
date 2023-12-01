const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllGroutes = async() => {

    return await prisma.grout.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.createGrout = async (data) => {

   
  try{
    const grout=await prisma.grout.create({

      data,
      
    });

    console.log(grout)
    return grout;
}
catch(error)
{
  console.log(error)
  return error;
}
      
};

exports.updateGrout = async (id, data) => {

  try{
      const grout=await prisma.grout.update({

        where: { idgrout: parseInt(id) },
        data,
        
      });

      console.log(grout)
      return grout;
  }
  catch(error)
  {
    console.log(error)
    return error;
  }
   
};

exports.setGroutStatus = async (id, data) => {
  try {

    const grout = await prisma.grout.update({

      where: {

        idgrout: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return grout

  } catch (error) {

    console.log(error)
    return error
  }
}