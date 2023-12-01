
const sysUser = require('../models/sysUser.model');
const AuthManager = require('../middlewares/authMiddleware');
const EmailTemplate = require('../structs/EmailsTemplates/TemplateEmail');
const AnswerManager = require('../middlewares/AnswerManager');
const sendMail = require('../middlewares/emailMiddleware');
const passwordMiddleware = require('../middlewares/passwordMiddleware');
const circuitBreakerHandler = require('../middlewares/circuitBreakerHandler');
const ErrorCodesEnum = require('../structs/Errors/ErrorCodesEnum');
const sysuserSchemas = require('../joiSchemas/sysUser.schema')

//Circuit braker
const createSysUserBreaker = circuitBreakerHandler.createBreaker(sysUser.createSysUser);
const validateBreaker = circuitBreakerHandler.createBreaker(sysUser.getSysUserByEmail);
const getAllSysUsersBreaker = circuitBreakerHandler.createBreaker(sysUser.getAllSysUsers);
const getAllSysUsersByCompanyBreaker = circuitBreakerHandler.createBreaker(sysUser.getAllSysUsersByCompany);
const updateSysUserBreaker = circuitBreakerHandler.createBreaker(sysUser.updateSysUser);
const getUserByCompanyIdBreaker = circuitBreakerHandler.createBreaker(sysUser.getUserByCompanyId);
const getAllUserRolesBreaker = circuitBreakerHandler.createBreaker(sysUser.getAllUserRoles);
const getAllUserStatusBreaker = circuitBreakerHandler.createBreaker(sysUser.getAllUserStatus);

let userJwtData = {
  idsysuser: 0,
  email: "",
  sysUserRole_idsysuserRole: 0,
  userStatus_iduserStatus: 0
};

exports.registerUser = async (req, res) => {
  try {

    const {password, lastName, office_idoffice, phone, email, userName} = req.body;
    const hashedPassword = await passwordMiddleware.hashPassword(password);
    const tempCode = await passwordMiddleware.generateRandomCode(8);
    const hashedCode = await passwordMiddleware.hashPassword(tempCode);
    const now = new Date();
    const expDate = new Date(now);
    expDate.setDate(now.getDate() + 2);
    
    const data = {
      userName,
      lastName, 
      phone,
      office_idoffice,
      email,
      password: hashedPassword,
      tempPassword: hashedCode, 
      tempPasswordExpDate: expDate,
      userRole_iduserRole: 3,
      userStatus_iduserStatus : 1,
      creationDate: now
    }

    const user = await  createSysUserBreaker.fire(data);

    console.log(user);
    
    const jwtToken = passwordMiddleware.generateJWT({userId: user.idsysuser, validationCode: tempCode, mail: email}, "120m");
    const fullUrl = `${req.protocol}://${req.get('host')}/api/sysUser/activate/${jwtToken}?redirect=true`;
    


    AnswerManager.handleSuccess(res, user);
  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};


exports.activateUser = async (req, res) => {
  const { token } = req.params;
  const { redirect } = req.query;

  try {
    AuthManager.validateJWT(token, res, async (err, decodedContent) => {
      if (err) {
        handleRedirectOrError(res, redirect, { status: ErrorCodesEnum.NETWORK_AUTHENTICATION_REQUIRED, printMessage: "Token Invalid" });
        return;
      }

      const data = decodedContent;
      if (!data) {
        handleRedirectOrError(res, redirect, err);
        return;
      }

      const user = await sysUser.getSysUserById(data.userId);
      if (!user) {
        handleRedirectOrError(res, redirect, err);
        return;
      }

      const passwordValidation = {
        PasswordForValidate: data.validationCode,
        storedPasswordHash: user.validationCode
      };

      AuthManager.validatePassword(passwordValidation, res, async (err) => {
        if (err) {
          handleRedirectOrError(res, redirect);
          return;
        }

        const newUserData = {
          validationCode: "",
          userStatus_iduserStatus: 2
        };
        await sysUser.updateSysUser(user.idsysuser, newUserData);

        if (redirect) {
          res.redirect('/SuccessActivate.html');
        } else {
          AnswerManager.handleSuccess(res);
        }
      });
    });
  } catch (error) {
    handleRedirectOrError(res, redirect, error);
  }
};

function handleRedirectOrError(res, redirect, error = null) {
  if (redirect) {
    res.redirect('/FailedActivation.html');
  } else if (error) {
    AnswerManager.handleError(res, error);
  }
}


exports.loginUser = async (req, res) => {
  try {

    const user = await validateBreaker.fire(req.body.email);
    
    

    if (!user || user.userStatus_iduserStatus !== 1) {
      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }

    console.log(req.body)

    req.PasswordForValidate = req.body.password;
    req.storedPasswordHash = user.password;

    AuthManager.validatePassword(req, res, async (err) => {
      try {
        if (err) {
          AnswerManager.handleError(res, err);
          return;
        }

        Object.assign(userJwtData, {
          idsysuser: user.idsysuser,
          email: user.email,
          userStatus_iduserStatus: user.userStatus_iduserStatus,
          sysUserRole_idsysuserRole: user.userRole_iduserRole
        });

        const endUser={
          name: user.userName+" "+user.lastName,
          rol:user.userRole_iduserRole,
          email:user.email,
          companyImage:user.companyImagePath
        };


        const jwt = passwordMiddleware.generateJWT(userJwtData, "7d");
        AnswerManager.handleSuccess(res, { message: 'Logged in successfully', token: jwt,user:endUser });

      } catch (internalError) {
        AnswerManager.handleError(res, internalError);
      }
    });

  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};


exports.loginSwwager = async (req, res) => {
  try {

    const user = await validateBreaker.fire(req.body.email);
    

    if (!user || user.userStatus_iduserStatus !== 1) {
      return AnswerManager.handleError(res, { message: user ? 'User not activated' : 'User not found' });
    }

    req.PasswordForValidate = req.body.password;
    req.storedPasswordHash = user.password;

    AuthManager.validatePassword(req, res, async (err) => {
      try {
        if (err) {
          AnswerManager.handleError(res, err);
          return;
        }

        Object.assign(userJwtData, {
          idsysuser: user.idsysuser,
          email: user.email,
          userStatus_iduserStatus: user.userStatus_iduserStatus,
          sysUserRole_idsysuserRole: user.userRole_iduserRole
        });

        if(user.userRole_iduserRole!==1)
        {
          const err = new Error("User Doesnt Have Permissions");
          err.status = 400;
          AnswerManager.handleError(res,err );
          return;
        }

       
       
        const jwt = passwordMiddleware.generateJWT(userJwtData, "7d");
        AnswerManager.handleSuccess(res, { message: 'Logged in successfully',token:jwt});

      } catch (internalError) {
        AnswerManager.handleError(res, internalError);
      }
    });

  } catch (error) {
    AnswerManager.handleError(res, error);
  }
};

exports.getAllSysUsers = async (req, res) => {
  try {

    const users = await getAllSysUsersBreaker.fire() 

    AnswerManager.handleSuccess(res, users)

  } catch (error) {

    AnswerManager.handleError(res, error)
  }

}

exports.getAllSysUsersByCompany = async (req, res) => {
  try {

    const users = await getAllSysUsersByCompanyBreaker.fire(req.params.companyId) 

    AnswerManager.handleSuccess(res, users)

  } catch (error) {

    AnswerManager.handleError(res, error)
  }

}

exports.updateSysUser = async (req, res) => {
  try {

    const id = req.params.id
    const data = req.body
    const updatedUser = await updateSysUserBreaker.fire(id, data);

    AnswerManager.handleSuccess(res, updatedUser, 'Company updated successfully');

  } catch (error) {
    console.log(error)
    error.printMessage = "Couldn't update Company";

    AnswerManager.handleError(res, error);

  }
};

exports.getUserByCompanyId = async (req, res) => {
  try {

    const id = req.params.id

    const users = await getUserByCompanyIdBreaker.fire(id)

    if(users) {

      AnswerManager.handleSuccess(res, users)

    } else {

      AnswerManager.handleError(res, err, 'None user found in company')
    }

  } catch (error) {

    console.log(error)
    error.printMessage = "Couldn't get users";

    AnswerManager.handleError(res, error);
  }
}

exports.getAllUserRoles = async (req, res) => {
  try {

    const roles = await getAllUserRolesBreaker.fire()

    AnswerManager.handleSuccess(res, roles)

  } catch (error) {

    AnswerManager.handleError(res, error)
  }
}

exports.getAllUserStatus = async (req, res) => {
  try {

    const status = await getAllUserStatusBreaker.fire()

    AnswerManager.handleSuccess(res, status)

  } catch (error) {

    AnswerManager.handleError(res, error)
  }
}