const express = require('express')

const _ = require('underscore');

const backgrounddesing = require('../controllers/backgrounddesing');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express()
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

app.post("/backgrounddesing/createBackgroundDesing", [verificaToken,verificaAdminRol,validarArchivoSubir],backgrounddesing.createBackgroundDesing);
// app.post("/backgrounddesing/getBackgroundDesingby", [verificaToken,verificaAdminRol,validarArchivoSubir],backgrounddesing.getBackgroundDesingby);


module.exports = app;