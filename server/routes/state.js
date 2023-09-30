// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createState,updateState,getAllState,deleteState} = require('../controllers/state');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
// const {  validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createState', [verificaToken, verificaAdminRol], createState);
app.post('/updateState', [verificaToken, verificaAdminRol], updateState);
app.delete('/deleteState', [verificaToken, verificaAdminRol], deleteState);
app.get('/getAllState', getAllState);
// app.get('/deteleState', [verificaToken, verificaAdminRol], deteleState);

module.exports = app;
