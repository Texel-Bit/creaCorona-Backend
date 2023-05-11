// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { getAllDesignColorType} = require('../controllers/designColorType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

app.get('/getAllDesignColorType', [verificaToken, verificaAdminRol], getAllDesignColorType);


 
// Exporta el Router de Express
module.exports = app;
