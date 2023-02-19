const express = require('express')
const app = express()

const _ = require('underscore');

const sysUser = require('../controllers/sysUser');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

app.post("/sysUser/createUser",[verificaToken,verificaAdminRol], sysUser.createUser);
app.post("/sysUser/recoverPassword", sysUser.recoverPassword);
app.post("/sysUser/login", sysUser.login);
app.post("/sysUser/changePassword",[verificaToken], sysUser.changePassword);
app.post("/sysUser/updateUser",[verificaToken], sysUser.updateUser);
app.get("/sysUser/getAllUsers",[verificaToken,verificaAdminRol], sysUser.getAllUsers);






app.post("/sysUser/updateStatusByIdUser",[verificaToken,verificaAdminRol], sysUser.updateStatusByIdUser);






// app.post("/sysUser/LoginUserJWT", sysUser.LoginUserJWT);





module.exports = app;