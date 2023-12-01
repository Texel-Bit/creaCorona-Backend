const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesign = async() => {

    return await prisma.design.findMany({

      where: {

        OR: [

          {status: 1},
          
          {status: 2}
        ]
      }
    })
}

exports.getAllDesignsByDesignTypeId = async (designTypeId) => {

  try{
    const designs=await prisma.design.findMany({
      where: {
          DesignType_idDesignType:parseInt(designTypeId)
      },
      include:{
        DesignType:true,
        DesignColorType:true
        
      }
  });

  return designs;
  }
  catch(err)
  {
    console.log(err);
    return err;
  }
  

}

exports.getDesignsByEnvironmentType = async (EnvironmentType_idEnvironmentType, DesignType_idDesignType)  => {
  try {

    const designColorTypes = await prisma.designColorType_has_DesignType.findMany({

    where: {

      AND: [

        {EnvironmentType_idEnvironmentType: EnvironmentType_idEnvironmentType},

        {DesignType_idDesignType: DesignType_idDesignType}

      ]
    }
    
  });

  const colorTypesIds = designColorTypes.map((item) => item.DesignColorType_idDesignColorType)

  console.log(colorTypesIds)

  const designs = await prisma.design.findMany({

    where: {

      AND: [

        {DesignType_idDesignType: DesignType_idDesignType},

        {DesignColorType_idDesignColorType: {

          in: colorTypesIds
        }}


      ]
    }
  })


  return designs;


  } catch (error) {

    return error
  }
};

exports.createDesign = async (data) => {

    return await prisma.design.create({

        data

    })
      
};

exports.updateDesign = async (id, data) => {

  return await prisma.design.update({

    where: { idDesign: parseInt(id) },
    data,
    
  });
};

exports.setDesignStatus = async (id, data) => {
  try {

    const design = await prisma.Design.update({

      where: {

        idDesign: parseInt(id)
      },

      data: {

        status: data.status
      }
    })

    return design

  } catch (error) {

    console.log(error)
    return error
  }
}