const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllDesignColorInBundle = async() => {

    return await prisma.designColorInBundle.findMany()

}

exports.createDesignColorInBundle = async (data) => {

    return await prisma.designColorInBundle.create({

        data

    })
      
};

exports.deleteDesignColorInBundle = async (DesignColorBundle_idDesignColorBundle, DesignColors_idDesignColors) => {

  try {

    const deletedDesignColorInBundle = await prisma.designColorInBundle.deleteMany({

      where: {

        AND: [

          {DesignColorBundle_idDesignColorBundle},

          {DesignColors_idDesignColors}
        ]
      }
    })

    console.log("sfffsdffd")
    return deletedDesignColorInBundle;

  } catch (error) {

    throw new Error('Error fetching DesignColorInBundle: ' + error.message);

  }
};

