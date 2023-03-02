// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesign,updateDesign,getAllDesign} = require('../controllers/design');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const {  validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesign', [verificaToken, verificaAdminRol,validarArchivoImagen], createDesign);
app.post('/updateDesign', [verificaToken, verificaAdminRol], updateDesign);
app.get('/getAllDesign', [verificaToken, verificaAdminRol], getAllDesign);



 
// Exporta el Router de Express
module.exports = app;
