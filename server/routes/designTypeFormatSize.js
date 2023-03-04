// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignTypeFormatSize,updateDesignTypeFormatSize,getAllDesignTypeFormatSize} = require('../controllers/designTypeFormatSize');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen, validarArchivoSubir } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignTypeFormatSize', [verificaToken, verificaAdminRol], createDesignTypeFormatSize);
app.post('/updateDesignTypeFormatSize', [verificaToken, verificaAdminRol], updateDesignTypeFormatSize);
app.get('/getAllDesignTypeFormatSize', [verificaToken, verificaAdminRol], getAllDesignTypeFormatSize);


 
// Exporta el Router de Express
module.exports = app;
