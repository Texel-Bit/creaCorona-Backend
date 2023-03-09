// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { getAllMosaicType} = require('../controllers/mosaicType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

app.get('/getAllMosaicType', [verificaToken, verificaAdminRol], getAllMosaicType);


 
// Exporta el Router de Express
module.exports = app;
