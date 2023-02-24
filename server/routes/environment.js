// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createEnvironment,updateEnvironment,getAllEnvironment} = require('../controllers/environment');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createEnvironment', [verificaToken, verificaAdminRol], createEnvironment);
app.post('/updateEnvironment', [verificaToken, verificaAdminRol], updateEnvironment);
app.get('/getAllEnvironment', [verificaToken, verificaAdminRol], getAllEnvironment);


 
// Exporta el Router de Express
module.exports = app;
