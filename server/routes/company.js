// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createCompany,updateCompany,getAllCompany} = require('../controllers/company');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createCompany', [verificaToken, verificaAdminRol,validarArchivoImagen], createCompany);
app.post('/updateCompany', [verificaToken, verificaAdminRol], updateCompany);
app.get('/getAllCompany', [verificaToken, verificaAdminRol], getAllCompany);


 
// Exporta el Router de Express
module.exports = app;
