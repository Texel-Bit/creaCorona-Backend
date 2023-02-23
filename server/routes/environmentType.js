// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createEnvironmentType,updateEnvironmentType} = require('../controllers/environmentType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createEnvironmentType', [verificaToken, verificaAdminRol], createEnvironmentType);
app.post('/updateEnvironmentType', [verificaToken, verificaAdminRol], updateEnvironmentType);


 
// Exporta el Router de Express
module.exports = app;
