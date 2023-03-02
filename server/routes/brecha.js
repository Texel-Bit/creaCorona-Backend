// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createBrecha,updateBrecha,getAllBrecha} = require('../controllers/brecha');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createBrecha', [verificaToken, verificaAdminRol,validarArchivoImagen], createBrecha);
app.post('/updateBrecha', [verificaToken, verificaAdminRol], updateBrecha);
app.get('/getAllBrecha', [verificaToken, verificaAdminRol], getAllBrecha);



// Exporta el Router de Express
module.exports = app;
