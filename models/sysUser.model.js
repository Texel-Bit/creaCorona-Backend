const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSysUser = async (data) => {
  console.log(data);
  
  try {

    const user = await prisma.sysUser.create({
      data
    });
    return user;

  } catch (error) {
    console.log(error);
  }
};

exports.getAllSysUsers = async () => {
  try {

     const users = await prisma.sysUser.findMany({

      select: {
        
        idsysuser: true,
        userName: true,
        lastName: true,
        email: true,
        phone: true,
        creationDate: true,
        userRole:true,
        userStatus:true,
        userRole_iduserRole: true,
        userStatus_iduserStatus: true,
        office_idoffice: true,
        // Include office details
        office: {
          select: {
            idoffice: true,
            officeDescription: true,
            Company: {
              select: {
                idCompany: true,
                CompanyName: true,
              },
            },
          },
        },
      },
    });

    return users;

  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.getAllSysUsersByCompany = async (companyId) => {
  try {

     const users = await prisma.sysUser.findMany({
      where: {
        office: {
          is: {
            Company_idCompany: parseInt(companyId),
          },
        },
      },
      select: {
        
        idsysuser: true,
        userName: true,
        lastName: true,
        email: true,
        phone: true,
        creationDate: true,
        userRole:true,
        userStatus:true,
        userRole_iduserRole: true,
        userStatus_iduserStatus: true,
        office_idoffice: true,
        // Include office details
        office: {
          select: {
            idoffice: true,
            officeDescription: true,
            Company: {
              select: {
                idCompany: true,
                CompanyName: true,
              },
            }
          },
        },
      },
    });

    return users;

  } catch (error) {
    console.error(error);
    return error;
  }
};

exports.getSysUserById = async (id) => {
  return await prisma.sysUser.findUnique({
    where: {
      idsysuser: parseInt(id),
    },
  });
};

exports.updateSysUser = async (id, data) => {
  try {
    
    const users = await prisma.sysUser.update({
      where: {
        idsysuser: parseInt(id),
      },
      
      data: {
        
        userName: data.userName, 
        phone: data.phone, 
        lastName: data.lastName, 
        email: data.email, 
        userRole_iduserRole: data.userRole_iduserRole, 
        office_idoffice: data.office_idoffice,
        userStatus_iduserStatus: data.userStatus_iduserStatus
      },
    });
    
    console.log(data);
    console.log(users);
    return users

  } catch (error) {
    console.log(error)
    return error
  }
};

exports.deleteSysUser = async (id) => {
  return await prisma.sysUser.delete({
    where: {
      idsysUser: parseInt(id),
    },
  });
};

exports.getSysUserByEmail = async (email) => {

  try {

    console.log(email)
    const sysUser = await prisma.sysUser.findUnique({
      where: {
        email: email
      },
      include: {
        office: {
          include: {
            Company: {
              select: {
                CompanyImagePath: true 
              }
            }
          }
        }
      }
    });
  
    console.log(sysUser)
    if (!sysUser) {
      throw new Error('SysUser not found');
    }
  
    // Access the CompanyImagePath from the retrieved data
    const companyImagePath = sysUser.office?.Company?.CompanyImagePath || null;
  
    return {
      ...sysUser,
      companyImagePath
    };

  } catch (error) {

    console.log(error);
    return error
  }

};

exports.getUserByCompanyId = async (id) => {
  try {
    // Fetch offices based on the company ID
    const officeInCompany = await prisma.office.findMany({
      where: { Company_idCompany: parseInt(id) },
    });

    const officesIds = officeInCompany.map((item) => item.idoffice);

    // Fetch users based on office IDs and include necessary relations
    const usersInCompany = await prisma.sysUser.findMany({
      where: {
        office_idoffice: { in: officesIds },
      },
      select: {
        idsysuser: true,
        userName: true,
        lastName: true,
        email: true,
        phone: true,
        creationDate: true,
        userRole_iduserRole: true,
        userStatus_iduserStatus: true,
        office_idoffice: true,
        // Include office details
        office: {
          select: {
            idoffice: true,
            officeDescription: true,
            // Include company details
            Company: {
              select: {
                idCompany: true,
                CompanyName: true,
              },
            },
          },
        },
      },
    });

    return usersInCompany;

  } catch (error) {
    console.log(error);
    return error;
  }
};


exports.getAllUserRoles = async () => {
  try {

    const roles = await prisma.userRole.findMany()

    return roles

  } catch (error) {

    return error
  }
}

exports.getAllUserRoles = async () => {
  try {

    const roles = await prisma.userRole.findMany()

    return roles

  } catch (error) {

    return error
  }
}

exports.getAllUserStatus = async () => {
  try {

    const status = await prisma.userStatus.findMany();

    return status;

  } catch (error) {

    return error;
  }
}