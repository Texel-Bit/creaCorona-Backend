// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createUser, recoverPassword, login, changePassword, getAllUsers, updateUser,updateUserStatus,createUserMasive,getCounselors } = require('../controllers/sysUser');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createUser', [verificaToken, verificaAdminRol], createUser);
app.post('/recoverPassword', recoverPassword);
app.post('/login', login);
app.post('/changePassword', [verificaToken], changePassword);
app.get('/getAllUsers', [verificaToken, verificaAdminRol], getAllUsers);
app.post('/updateUser', [verificaToken], updateUser);
app.post('/updateUserStatus', [verificaToken,verificaAdminRol], updateUserStatus);
app.post('/createUserMasive', [verificaToken, verificaAdminRol], createUserMasive);
app.post('/getCounselors', [verificaToken], getCounselors);


 
// Exporta el Router de Express
module.exports = app;
