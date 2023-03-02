// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createFormatSizeTexture,updateFormatSizeTexture,getAllFormatSizeTexture} = require('../controllers/formatSizeTexture');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createFormatSizeTexture', [verificaToken, verificaAdminRol,validarArchivoImagen], createFormatSizeTexture);
app.post('/updateFormatSizeTexture', [verificaToken, verificaAdminRol], updateFormatSizeTexture);
app.get('/getAllFormatSizeTexture', [verificaToken, verificaAdminRol], getAllFormatSizeTexture);


 
// Exporta el Router de Express
module.exports = app;
