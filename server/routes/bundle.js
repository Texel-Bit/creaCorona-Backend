// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createBundle,updateBundle,getAllBundle} = require('../controllers/bundle.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createBundle', [verificaToken, verificaAdminRol], createBundle);
app.post('/updateBundle', [verificaToken, verificaAdminRol], updateBundle);
app.get('/getAllBundle', [verificaToken, verificaAdminRol], getAllBundle);



// Exporta el Router de Express
module.exports = app;
