const {
  createUser,
  findOneLoginByEmail,
  recoverPassword,
  changePassword,
  getAllUsers,
  updateUser,
  updateUserStatus
} = require("../models/sysUser");
const randompassword = require("secure-random-password");
const { promisify } = require('util');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const date = require("date-and-time");
const emailSend = require("../helpers/email");
const hashRounds = 15;

exports.recoverPassword = async (req, res) => {
  try {
    // Obtener el correo electrónico de la petición
    const { email } = req.body;

    // Generar una contraseña temporal aleatoria y una fecha de expiración para ella
    const passwordrecover = randompassword.randomPassword({
      length: 6,
      characters: [randompassword.upper, randompassword.digits],
    });
    const tempPasswordExpDate = new Date();
    tempPasswordExpDate.setDate(tempPasswordExpDate.getDate() + 2);

    // Encriptar la contraseña temporal
    const hashedPassword = await bcrypt.hash(passwordrecover, 15);

    // Actualizar los datos del usuario con la contraseña temporal y su fecha de expiración
    const user = {
      email,
      tempPassword: hashedPassword,
      tempPasswordExpDate,
      passwordrecover,
    };
    const { count } = await recoverPassword(user);

    if (count === 0) {
      // Si el correo electrónico no existe en la base de datos, enviar una respuesta 200
      res.status(200).json({
        status: false,
        message: 'El correo electrónico no existe',
      });
      return;
    }

    // Enviar el correo electrónico con la contraseña temporal al usuario
    await emailSend.sendEmailRecoverPassword(user);

    // Enviar una respuesta 200 si todo ha ido bien
    res.json({
      status: true,
    });
  } catch (error) {
    // Enviar una respuesta 400 si hay algún error
    res.status(400).json({
      status: false,
      error: {
        message: 'Error al recuperar la contraseña',
      },
    });
  }
};

// Manejador de ruta para crear un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    // Validar que la solicitud contenga datos
    if (!req.body) {
      res.status(400).json({
        status: false,
        error: "La solicitud debe contener datos",
      });
      return;
    }

    // Desestructurar los datos de la solicitud
    const {
      userName,
      lastName,
      email,
      phone,
      password = "*********",
      creationDate = new Date(),
      iduserRole,
      iduserStatus = 1,
      idCompany,
    } = req.body;

    // Configurar los datos para el nuevo usuario
    const userData = {
      userName,
      lastName,
      email,
      phone,
      password,
      creationDate,
      userRole: { connect: { iduserRole: +iduserRole } },
      userStatus: { connect: { iduserStatus } },
      Company: { connect: { idCompany: +idCompany } },
    };

    // Buscar si ya existe un usuario con el mismo email o userName
    const result = await findOneLoginByEmail(userData);

    if (result?.length) {
      res.status(400).json({
        status: false,
        message: "El userName o Email ya existe",
      });
    } else {
      // Crear el nuevo usuario
      const createdUser = await createUser(userData);

      res.json({
        status: true,
        data: createdUser,
      });
    }
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: false,
      message: "Error al crear el usuario",
    });
  }
};




exports.login = async (req, res, next) => {
  // Constantes para los mensajes de error
  const INVALID_USER_OR_PASSWORD = "Incorrect user or password";
  const EXPIRED_PASSWORD = "clave vencida";
  const INVALID_CREDENTIALS = "Usuario o (contraseña) incorrectos";

  // Obtener el email y la contraseña del usuario desde el cuerpo de la solicitud
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    // Buscar al usuario por su email en la base de datos
    const result = await findOneLoginByEmail(user);
    const data = result[0];

    // Si el usuario no existe, devolver un error
    if (!data) {
      return res.status(200).json({
        status: false,
        err: {
          message: INVALID_USER_OR_PASSWORD,
        },
      });
    }

    // Obtener la fecha actual y formatearla
    const now = new Date();
    now.setDate(now.getDate());
    const fecha = date.format(now, "YYYY-MM-DD HH:mm:ss");

    // Si la contraseña es incorrecta
    if (!bcrypt.compareSync(user.password, data.password)) {
      // Si la contraseña temporal ha expirado, devolver un error
      if (fecha > data.tempPasswordExpDate) {
        return res.status(400).json({
          status: false,
          message: EXPIRED_PASSWORD,
        });
      }

      // Si la contraseña temporal es incorrecta, devolver un error
      if (!bcrypt.compareSync(user.password, data.tempPassword)) {
        console.log("clave temporal");
        return res.status(400).json({
          status: false,
          message: INVALID_CREDENTIALS,
        });
      } else {
        // Si la contraseña temporal es correcta, generar un token y devolver el usuario y el token
        delete data.password;
        const token = jwt.sign(
          {
            user: data,
          },
          process.env.SEED,
          { expiresIn: process.env.CADUCIDAD_TOKEN }
        );
        res.setHeader("token", token);

        delete data.tempPassword;
        delete data.tempPasswordExpDate;
        res.json({
          status: true,
          isTmpPassword: true,
          user: data,
          token,
        });
        return;
      }
    } else {
      // Si la contraseña es correcta, generar un token y devolver el usuario y el token
      delete data.password;
      const token = jwt.sign(
        {
          user: data,
        },
        process.env.SEED,
        { expiresIn: process.env.CADUCIDAD_TOKEN }
      );
      res.setHeader("token", token);

      delete data.tempPassword;
      delete data.tempPasswordExpDate;
      res.json({
        status: true,
        isTmpPassword: false,
        user: data,
        token,
      });
    }
  } catch (err) {
    // Si hay un error, devolver un error 500 con el mensaje de error
    res.status(500).send({
      status: false,
      message: err,
    });
  }
};



exports.changePassword = async (req, res) => {
  try {
    // Obtener token y desestructurar id del usuario
    const token = req.get('JWT');
    const { user: { idsysuser } } = await promisify(jwt.verify)(token, process.env.SEED);

    // Generar nueva contraseña hasheada
    const newPassword = bcrypt.hashSync(req.body.password, hashRounds);

    // Actualizar contraseña en la base de datos
    const updatedData = await changePassword({ idsysuser, password: newPassword });

    // Devolver respuesta con datos actualizados
    res.json({
      status: true,
      data: updatedData,
    });
  } catch (error) {

    // Devolver respuesta con error si falla
    return res.status(400).json({
      ok: false,
      err: {
        message: 'Usuario o (contraseña) incorrectos',
      },
    });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allUsers = await getAllUsers();

    // Eliminar la contraseña de cada usuario antes de enviar la respuesta
    const usersWithoutPassword = allUsers.map((user) => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: usersWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'No se pudo obtener los usuarios.',
    });
  }
};


exports.updateUser = (req, res, next) => {
  const token = req.get("JWT");
  let rol;
  let id;

  // Verificar el token y extraer el rol y el id del usuario
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      // Enviar un error si no se pudo verificar el token
      return res.status(500).send({
        message: "Some error occurred while creating the userTypeCompanyUser.",
      });
    }

    req.usuario = decode.user;

    rol = decode.user.userRole_iduserRole;
    id = +decode.user.idsysuser;
  });

  // Desestructurar los campos del cuerpo de la petición
  const { idsysuser, userName,phone, lastName, email, iduserRole, idCompany } = req.body;

  // Verificar si el cuerpo de la petición existe
  if (!req.body) {
    return res.status(400).json({
      status: false,
      error: "error",
    });
  }

  // Crear el objeto de datos para actualizar el usuario
  const data = {
    userName,
    lastName,
    email,
    phone,
  };

  if (rol == 1) {
    // Si el rol es administrador, agregar los campos adicionales al objeto de datos
    data.idsysuser = +idsysuser;
    data.userRole = { connect: { iduserRole: +iduserRole } };
    data.Company = { connect: { idCompany: +idCompany } };
  } else {
    // Si el rol no es administrador, utilizar el id del usuario actual
    data.idsysuser = id;
  }

  // Actualizar el usuario
  updateUser(data, (err, result) => {
    if (err) {
      // Enviar un error si la actualización falla
      return res.status(500).json({
        status: false,
        error: err,
      });
    }
    
    // Eliminar campos sensibles del objeto de resultado
    delete result.password;
    delete result.tempPassword;
    delete result.tempPasswordExpDate;

    // Enviar el resultado de la actualización al cliente
    res.json({
      status: true,
      user: result,
    });
  });
};

//Sin uso

exports.updateUserStatus = (req, res, next) => {
  // Desestructurar los campos del cuerpo de la petición
  const { idsysuser, iduserStatus } = req.body;

  // Verificar si el cuerpo de la petición existe
  if (!req.body) {
    return res.status(400).json({
      status: false,
      error: "error",
    });
  }

  // Crear el objeto de datos para actualizar el usuario
  const data = {
    idsysuser:+idsysuser,
    userStatus: { connect: { iduserStatus: +iduserStatus } }

  };


  // Actualizar el usuario
  updateUserStatus(data, (err, result) => {
    if (err) {
      // Enviar un error si la actualización falla
      return res.status(500).json({
        status: false,
        error: err,
      });
    }
    


    // Enviar el resultado de la actualización al cliente
    res.json({
      status: true,
      user: result,
    });
  });
};
// exports.getUserById = (req, res) => {
//   // Validate request

//   if (!req.body) {
//     res.status(400).json({
//       status: "error",
//       error: "tbl_user_type_description Content can not be empty!",
//     });
//     return;
//   }

//   // Create a Customer
//   const user = new User({
//     iduser: req.body.iduser,
//   });

//   User.getUserById(user, (err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message ||
//           "Some error occurred while creating the userTypeCompanyUser.",
//       });
//     else {
//       // let token = jwt.sign({
//       //     user: user,
//       // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//       // res.setHeader('token', token);

//       res.json({
//         status: true,
//         data,
//       });
//     }
//   });
// };
