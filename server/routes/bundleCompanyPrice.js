// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createBundleCompanyPrice,updateBundleCompanyPrice,getAllBundleCompanyPrice} = require('../controllers/bundleCompanyPrice.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createBundleCompanyPrice', [verificaToken, verificaAdminRol], createBundleCompanyPrice);
app.post('/updateBundleCompanyPrice', [verificaToken, verificaAdminRol], updateBundleCompanyPrice);
app.get('/getAllBundleCompanyPrice', [verificaToken, verificaAdminRol], getAllBundleCompanyPrice);


 
// Exporta el Router de Express
module.exports = app;
