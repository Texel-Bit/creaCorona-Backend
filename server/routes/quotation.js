// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createquotation,updatequotation,getAllQuotation,simulateQuotation} = require('../controllers/quotation.js');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const {  validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createquotation', [verificaToken, verificaAdminRol], createquotation);
app.post('/simulateQuotation', [verificaToken, verificaAdminRol], simulateQuotation);

app.get('/getAllQuotation', [verificaToken, verificaAdminRol], getAllQuotation);


 
// Exporta el Router de Express
module.exports = app;
