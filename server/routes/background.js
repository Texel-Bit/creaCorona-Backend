const express = require('express')

const _ = require('underscore');

const background = require('../controllers/background');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express()
const { validarArchivoSubir } = require('../middlewares/validar-archivo');



app.post("/background/createBackground", [verificaToken,verificaAdminRol,validarArchivoSubir],background.createBackground);
app.post("/background/updateBackground", [verificaToken,verificaAdminRol],background.updateBackground);
app.post("/background/deleteBackground", [verificaToken,verificaAdminRol],background.deleteBackground);

app.get("/background/getAllBackground",[verificaToken], background.getAllBackground);


module.exports = app;