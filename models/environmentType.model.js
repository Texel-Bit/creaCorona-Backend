const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllEnvironmentTypes = async() => {

    return await prisma.environmentType.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      },

      include: {

        DesignType_EnvironmentType: true
      }
    })

}

exports.createEnviormentType = async (data) => {

  try {
    console.log("fsdfsfd", data)
    const createdEnvironmentype = await prisma.environmentType.create({

      data

    })

    console.log(createdEnvironmentype)
    return createdEnvironmentype;
  } catch (error) {

    throw new Error('Error fetching DesignColorTypes: ' + error.message);

  }
      
};

exports.updateEnvironmentType = async (id, data) => {

  return await prisma.environmentType.update({

    where: { idEnvironmentType: parseInt(id) },
    data,
    
  });
};

exports.getAllDesignTypeEnvironmentType = async () => {

  return await prisma.designType_EnvironmentType.findMany();
  
}

exports.getAllDesignTypeByEnvironmentType = async (idEnvironmentType) => {

  try{
    const data=  await prisma.designType_EnvironmentType.findMany({
      where:{
        EnvironmentType_idEnvironmentType:parseInt(idEnvironmentType)
      },
      include:{
        DesignType:true
      }
    });

    return data.map(item => item.DesignType);
  }
  catch(error)
  {
    console.log(error)
    return error;
  }
 
  
}

exports.createDesignTypeEnvironmentType = async (data) => {
  try {

    console.log(data);

    if (data.EnvironmentType_idEnvironmentType) {
      const DesignTypeEnvironmentType = await prisma.designType_EnvironmentType.findFirst({
    
        where: {
          EnvironmentType_idEnvironmentType: {
            equals: data.EnvironmentType_idEnvironmentType,
          },
          DesignType_idDesignType: {
            equals: data.DesignType_idDesignType,
          },
        }
      });

      if(!DesignTypeEnvironmentType)
      {
        const result = await prisma.designType_EnvironmentType.createMany({
          data,
        });
        return result;
      }
      
        return DesignTypeEnvironmentType;
      
    }
 
  } catch (e) {

    return e;
  } finally {
    // Siempre desconectar la base de datos después de la operación
    await prisma.$disconnect();
  }
};

exports.deleteDesignTypeEnvironmentType = async (EnvironmentType_idEnvironmentType, DesignType_idDesignType) => {

  try {

    const deletedDesignTypeEnvironmentType = await prisma.designType_EnvironmentType.deleteMany({

      where: {

        AND: [

          {EnvironmentType_idEnvironmentType},

          {DesignType_idDesignType}
        ]
      }
    })

    console.log("sfffsdffd")
    return deletedDesignTypeEnvironmentType;

  } catch (error) {

    throw new Error('Error fetching DesignTypeEnvironmentType: ' + error.message);

  }
};

exports.createDesignTypeFormatSizeForEnvironmentType = async (data) => {
  

  try {

    const allRecords= await prisma.designTypeFormatSize_has_EnvironmentType.createMany({
      data
     })
  
      return allRecords;

  } catch (e) {

    console.log(e)
    return e;

  } 
};

exports.deleteDesignTypeFormatSizeForEnvironmentType = async (idDesignFormat, idEnvironment) => {
  try {

    const deletedDesignFormatSize = await prisma.designTypeFormatSize_has_EnvironmentType.delete({

      where: {

        AND: [

          {DesignTypeFormatSize_idDesignTypeFormatSize: parseInt(idDesignFormat)},

          {EnvironmentType_idEnvironmentType: parseInt(idEnvironment)}
        ]
      }

    })

    return deletedDesignFormatSize

  } catch (e) {
    console.error(e);
    return e;
  } finally {
    await prisma.$disconnect();
  }
};

exports.getAllDesignTypeFormatSizeForEnvironmentType = async (body,data) => {
  try {
    

    const{EnvironmentType_idEnvironmentType, DesignType_idDesignType}=body;

    
    // Step 1: Fetch the related records based on EnvironmentType_idEnvironmentType
    const records = await prisma.designTypeFormatSize_has_EnvironmentType.findMany({
      where: {
        EnvironmentType_idEnvironmentType,
      },
      include: {
        DesignTypeFormatSize: true
      }
    });

    console.log(records)
    // Step 2: Fetch the DesignTypeFormatSize records based on DesignType_idDesignType
    const designTypeFormatSizeRecords = await prisma.designTypeFormatSize.findMany({
      where: {
        DesignType_idDesignType
      }
    });

    // Combine the information.
    const data = records.map(record => ({
      ...record,
      DesignTypeFormatSize: designTypeFormatSizeRecords.find(d => d.idDesignTypeFormatSize === record.DesignTypeFormatSize_idDesignTypeFormatSize)
    })).filter(record => record.DesignTypeFormatSize); // This filters out any records where the DesignTypeFormatSize was not found

    return data

  } catch (e) {
    console.error(e);
    return e;
  }
};

exports.getDesignColorTypesByEnvironmentIdAndDesignType = async (EnvironmentType_idEnvironmentType, DesignType_idDesignType)  => {
  try {
    console.log('sffgdgdfgdfgfdgfdgfgfdgdfg')

    const designColorTypes = await prisma.designColorType_has_DesignType.findMany({

    where: {

      AND: [

        {EnvironmentType_idEnvironmentType: EnvironmentType_idEnvironmentType},

        {DesignType_idDesignType: DesignType_idDesignType}

      ]
    }
    
  });

  console.log(designColorTypes)

  return designColorTypes;


  } catch (error) {

    return error
  }
};

exports.getAllDesignColorTypeHasDesignType = async () => {

  return await prisma.designColorType_has_DesignType.findMany()
    
};

exports.addDesignColorTypeToEnvironmentType = async (data) => {

  try {
    
   const allRecords= await prisma.designColorType_has_DesignType.createMany({
    data
   })

    return allRecords;

  } catch (error) {
    
    console.log(error);

    throw new Error('Error fetching DesignColorTypes: ' + error.message);

  } 
};

exports.deleteFormatSizeOfEnvironmentType = async (data) => {
  try {
    // Assuming data contains DesignType_idDesignType and EnvironmentType_idEnvironmentType
    const {  EnvironmentType_idEnvironmentType,DesignTypeFormatSize_idDesignTypeFormatSize } = data;

  
    // Deleting records from DesignColorType_has_DesignType table
    const deleteResponse = await prisma.designTypeFormatSize_has_EnvironmentType.deleteMany({
      where: {
        EnvironmentType_idEnvironmentType: EnvironmentType_idEnvironmentType,
        DesignTypeFormatSize_idDesignTypeFormatSize: {
          in: DesignTypeFormatSize_idDesignTypeFormatSize
        }
      }
    });

    return {DeletedCount: deleteResponse.count };
  } catch (error) {
    return error;
  } 
};

exports.deleteDesignColorsTypeOfEnvironmentType = async (data) => {
  try {
    // Assuming data contains DesignType_idDesignType and EnvironmentType_idEnvironmentType
    const { DesignType_idDesignType, EnvironmentType_idEnvironmentType } = data;

    // Deleting records from DesignColorType_has_DesignType table
    const deleteResponse = await prisma.DesignColorType_has_DesignType.deleteMany({
      where: {
        DesignType_idDesignType: DesignType_idDesignType,
        EnvironmentType_idEnvironmentType: EnvironmentType_idEnvironmentType
      }
    });

    return { Status: "Success", DeletedCount: deleteResponse.count };
  } catch (error) {
    throw new Error('Error deleting DesignColorTypes: ' + error.message);
  } 
};


exports.setEnvironmentTypeStatus = async (id, data) => {
  try {

    const environmentType = await prisma.EnvironmentType.update({

      where: {

        idEnvironmentType: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return environmentType

  } catch (error) {

    console.log(error)
    return error
  }
}
