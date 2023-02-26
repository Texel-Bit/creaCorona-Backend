// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignCompany,updateDesignCompany,getAllDesignCompany} = require('../controllers/designCompany');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignCompany', [verificaToken, verificaAdminRol], createDesignCompany);
app.post('/updateDesignCompany', [verificaToken, verificaAdminRol], updateDesignCompany);
app.get('/getAllDesignCompany', [verificaToken, verificaAdminRol], getAllDesignCompany);


 
// Exporta el Router de Express
module.exports = app;
