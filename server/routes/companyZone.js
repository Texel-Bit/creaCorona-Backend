// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createCompanyZone,updateCompanyZone,getAllCompanyZone} = require('../controllers/companyZone.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createCompanyZone', [verificaToken, verificaAdminRol], createCompanyZone);
app.post('/updateCompanyZone', [verificaToken, verificaAdminRol], updateCompanyZone);
app.get('/getAllCompanyZone', [verificaToken, verificaAdminRol], getAllCompanyZone);


 
// Exporta el Router de Express
module.exports = app;
