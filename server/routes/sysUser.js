

const express = require('express');
const app = express.Router();
const { createUser, recoverPassword, login, changePassword, getAllUsers, updateStatusByIdUser } = require('../controllers/sysUser');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

app.post('/createUser', [verificaToken, verificaAdminRol], createUser);
app.post('/recoverPassword', recoverPassword);
app.post('/login', login);
app.post('/changePassword', [verificaToken], changePassword);
app.get('/getAllUsers', [verificaToken, verificaAdminRol], getAllUsers);
app.post('/updateStatusByIdUser', [verificaToken, verificaAdminRol], updateStatusByIdUser);

module.exports = app;