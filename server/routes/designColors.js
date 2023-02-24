// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignColors,updateDesignColors,getAllDesignColors} = require('../controllers/designColors');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignColors', [verificaToken, verificaAdminRol], createDesignColors);
app.post('/updateDesignColors', [verificaToken, verificaAdminRol], updateDesignColors);
app.get('/getAllDesignColors', [verificaToken, verificaAdminRol], getAllDesignColors);


 
// Exporta el Router de Express
module.exports = app;
