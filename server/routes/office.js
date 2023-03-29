// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createOffice,updateOffice,getAllOffice} = require('../controllers/office');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createOffice', [verificaToken, verificaAdminRol], createOffice);
app.post('/updateOffice', [verificaToken, verificaAdminRol], updateOffice);
app.get('/getAllOffice', [verificaToken, verificaAdminRol], getAllOffice);


 
// Exporta el Router de Express
module.exports = app;
