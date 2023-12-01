const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});


exports.getAllEnvironments = async() => {

    return await prisma.environment.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })

}

exports.getAllEnvironmentByEnvironmentType = async (id) => {
  try {
    const environment = await prisma.environment.findMany({
  
      where: {EnvironmentType_idEnvironmentType: parseInt(id)}
    })

    console.log(environment)

    return environment

  } catch (error) {

    return error
  }

}

exports.createEnviorment = async (data) => {
  console.log(data)
  try {

    const environment = await prisma.environment.create({
  
        data
  
    })

    console.log(environment)

    return environment

  } catch (error) {

    console.log(error)
    return error

  }

      
};

exports.updateEnvironment = async (id, data) => {
  return await prisma.environment.update({
    where: { idEnvironment: parseInt(id) },
    data,
  });
};

exports.setEnvironmentStatus = async (id, data) => {
  try {

    const environment = await prisma.Environment.update({

      where: {

        idEnvironment: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return environment

  } catch (error) {

    console.log(error)
    return error
  }
}