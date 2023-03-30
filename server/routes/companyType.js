// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createCompanyType,updateCompanyType,getAllCompanyType} = require('../controllers/companyType.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createCompanyType', [verificaToken, verificaAdminRol], createCompanyType);
app.post('/updateCompanyType', [verificaToken, verificaAdminRol], updateCompanyType);
app.get('/getAllCompanyType', [verificaToken, verificaAdminRol], getAllCompanyType);


 
// Exporta el Router de Express
module.exports = app;
