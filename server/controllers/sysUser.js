const {
  createUser,
  findOneLoginByEmail,
  recoverPassword,
  changePassword,
  getAllUsers
} = require("../models/sysUser");
const randompassword = require("secure-random-password");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const email = require("../helpers/email");

exports.recoverPassword = (req, res) => {
  let passwordrecover = randompassword.randomPassword({
    length: 6,
    characters: [randompassword.upper, randompassword.digits],
  });

  let date = new Date();

  // add a day
  date.setDate(date.getDate() + 2);
  const User = {
    email: req.body.email,
    tempPassword: passwordrecover,
    tempPasswordExpDate: date,
    passwordrecover,
  };

  // const passwordtmp = User.TmpPassword;
  User.tempPassword = bcrypt.hashSync(User.tempPassword, 15);

  recoverPassword(User, (err, data) => {
    if (err) {
      return res.status(400).json({
        status: false,
        err: {
          message: "correo no valido",
        },
      });
    }

    if (data.count == 0) {
      return res.status(200).json({
        status: false,
        message: "Correo no existe",
      });
    } else {
      email.sendEmailRecoverPassword(User, (err, data) => {
        if (err)
          return res.status(500).send({
            status: false,
            message: "no se pudo generar una contraseña temporal",
          });
      });

      res.json({
        status: true,
      });
    }
  });
};
exports.createUser = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).json({
      status: false,
      error: "error",
    });
    return;
  }

  const {
    userName,
    lastName,
    email,
    password = "*********",
    creationDate = new Date(),
    iduserRole,
    iduserStatus = 1,
    idCompany,
  } = req.body;

  data = {
    userName,
    lastName,
    email,
    password,
    creationDate,
    userRole: { connect: { iduserRole: +iduserRole } },
    userStatus: { connect: { iduserStatus } },
    Company: { connect: { idCompany: +idCompany } },
  };

  findOneLoginByEmail(data, (err, result) => {
    if (err)
      res.status(500).send({
        status: false,
        message: err,
      });

    console.log(result.length);
    if (result.length != 0) {
      res.status(400).send({
        status: false,
        message: "userName o Email ya existe",
      });
    } else {

      console.log(data);
      createUser(data, (err, result) => {
        if (err)
          res.status(500).send({
            status: false,

            message: "No se logro Crear el usuario.",
          });
        else {
          res.json({
            status: true,
            data: result,
          });
        }
      });
    }
  });
};

exports.login =  (req, res, next) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

   findOneLoginByEmail(user, (err, data) => {
    console.log(data, "todo");

    if (err)
      res.status(500).send({
        status: false,
        message: err,
      });

    if (data[0] == undefined) {
      return res.status(200).json({
        status: false,
        err: {
          message: "Incorrect user or password",
        },
      });
    }
    let now = new Date();
    now.setDate(now.getDate());
    const fecha = date.format(now, "YYYY-MM-DD HH:mm:ss");
    if (!bcrypt.compareSync(user.password, data[0].password)) {
      if (fecha > data.tempPasswordExpDate) {
        return res.status(400).json({
          status: false,
          message: "clave vencida",
        });
      }

      if (!bcrypt.compareSync(user.password, data[0].tempPassword)) {
        return res.status(400).json({
          status: false,
          message: "Usuario o (contraseña) incorrectos",
        });
      } else {
        delete data.password;
        let token = jwt.sign(
          {
            user: data[0],
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        res.setHeader("token", token);

        delete data[0].tempPassword;
        delete data[0].tempPasswordExpDate;
        res.json({
          status: true,
          isTmpPassword: true,
          user: data,
          token,
        });
        return;
      }
    } else {
      delete data.password;
      let token = jwt.sign(
        {
          user: data[0],
        },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN }
      );
      res.setHeader("token", token);

      delete data[0].tempPassword;
      delete data[0].tempPasswordExpDate;
      res.json({
        status: true,
        isTmpPassword: false,
        user: data,
        token,
      });
      return;
    }
  });
};

exports.changePassword = (req, res) => {
  let emailtoken = null;
  let token = req.get("JWT");
  let data = {};
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      res.status(500).send({
        message: "Some error occurred while creating the userTypeCompanyUser.",
      });
    }
    console.log(decode);

    req.usuario = decode.user;
    data.idsysuser = decode.user.idsysuser;
  });

  data.password = bcrypt.hashSync(req.body.password, 15);

  changePassword(data, (err, data) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario o (contraseña) incorrectos",
        },
      });
    } else {
      res.json({
        status: true,
        data,
      });
    }
  });
};
exports.getAllUsers = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).json({
      status: "error",
      error: "no se logro crear",
    });
    return;
  }

  getAllUsers((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "no se pudo consultar",
      });
    else {
    
      delete data.password;
      res.json({
        status: true,
        data,
      });
    }
  });
};
//Sin uso



exports.updateUser = (req, res, next) => {
  let token = req.get("JWT");

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      res.status(500).send({
        message: "Some error occurred while creating the userTypeCompanyUser.",
      });
    }

    req.usuario = decode.usuario;
    idsysuserjwt = decode.user.idsysuser;
    userRole_iduserRolejwt = decode.user.userRole_iduserRole;
  });

  const user = {
    idsysuser: req.body.idsysuser,
    userName: req.body.userName,
    userLastName: req.body.userLastName,
    email: req.body.email,
  };

  if (userRole_iduserRolejwt == 2) {
    user.idsysuser = req.body.idsysuser;
    user.userRole_iduserRole = req.body.userRole_iduserRole;
  } else {
    user.idsysuser = idsysuserjwt;
  }

  sysUser.updateUser(user, (err, data) => {
    res.json({
      status: true,
      user: data,
    });
  });
};

exports.updateStatusByIdUser = (req, res, next) => {
  let token = req.get("JWT");

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      res.status(500).send({
        message: "Some error occurred while creating the userTypeCompanyUser.",
      });
    }

    req.usuario = decode.usuario;
    idsysuserjwt = decode.user.idsysuser;
    userRole_iduserRolejwt = decode.user.userRole_iduserRole;
  });

  const user = {
    idsysuser: req.body.idsysuser,
    userStatus_iduserStatus: req.body.userStatus_iduserStatus,
  };

  sysUser.updateStatusByIdUser(user, (err, data) => {
    res.json({
      status: true,
      user: data,
    });
  });
};
exports.getUserById = (req, res) => {
  // Validate request

  if (!req.body) {
    res.status(400).json({
      status: "error",
      error: "tbl_user_type_description Content can not be empty!",
    });
    return;
  }

  // Create a Customer
  const user = new User({
    iduser: req.body.iduser,
  });

  User.getUserById(user, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the userTypeCompanyUser.",
      });
    else {
      // let token = jwt.sign({
      //     user: user,
      // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

      // res.setHeader('token', token);

      res.json({
        status: true,
        data,
      });
    }
  });
};

exports.LoginUserJWT = (req, res) => {
  let emailtoken = null;
  let token = req.get("JWT");

  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      res.status(500).send({
        message: "Some error occurred while creating the userTypeCompanyUser.",
      });
    }

    req.usuario = decode.usuario;
    iduser = decode.user.iduser;
    emailtoken = decode.user.email;
    UserName = decode.user.UserName;
    UserLastName = decode.user.UserLastName;
  });

  sysUser.findOneLoginid(iduser, (err, data) => {
    if (data == null) {
      return res.status(500).send({
        message: "La cuenta de correo no exista favor realizar registro",
      });
    } else {
      res.json({
        status: "ok",
        data,
      });
    }
  });
};

// exports.activeUserById = (req, res, next) => {

//     User.activeUserById(req.body, (err, data) => {

//         res.json({
//             status: true,
//             user: data,

//         });

//     });

// };

// exports.inactiveUserById = (req, res, next) => {
//     User.inactiveUserById(req.body, (err, data) => {

//         res.json({
//             status: true,
//             user: data,

//         });

//     });
// };

// exports.getUserByCompanyId = (req, res, next) => {
//     User.getUserByCompanyId(req.body, (err, data) => {

//         res.json({
//             status: true,
//             data

//         });

//     });
// };

// exports.getProjectUserById = (req, res, next) => {
//     User.getProjectUserById(req.body, (err, data) => {

//         res.json({
//             status: true,
//             data

//         });

//     });
// };

// exports.filterUsers = (req, res, next) => {
//     const filtros = ({
//         idcompany: req.body.idcompany,
//         idrol:req.body.idrol

//     });

//     User.filterUsers(filtros, (err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });

// };
