// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignType,updateDesignType,getAllDesignType,getAllDesignTypeTest} = require('../controllers/designType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignType', [verificaToken, verificaAdminRol,validarArchivoImagen], createDesignType);
app.post('/updateDesignType', [verificaToken, verificaAdminRol], updateDesignType);
app.get('/getAllDesignType', [verificaToken, verificaAdminRol], getAllDesignType);
app.post('/getAllDesignTypeTest', [verificaToken, verificaAdminRol], getAllDesignTypeTest);


 
// Exporta el Router de Express
module.exports = app;
