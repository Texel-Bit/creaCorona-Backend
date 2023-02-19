const express = require('express')
const app = express()

const _ = require('underscore');

const userRole = require('../controllers/userRole');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

app.get("/userRole/getAllUserRole", userRole.getAllUserRole);






module.exports = app;