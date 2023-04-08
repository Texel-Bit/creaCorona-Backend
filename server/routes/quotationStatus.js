// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { getAllQuotationStatus} = require('../controllers/quotationStatus.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.get('/getAllQuotationStatus', [verificaToken, verificaAdminRol], getAllQuotationStatus);


 
// Exporta el Router de Express
module.exports = app;
