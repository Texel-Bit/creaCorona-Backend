// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignColorBundle,updateDesignColorBundle,getAllDesignColorBundle,deleteDesignColorBundle} = require('../controllers/designColorBundles');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
// const {  validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignColorBundle', [verificaToken, verificaAdminRol], createDesignColorBundle);
app.post('/updateDesignColorBundle', [verificaToken, verificaAdminRol], updateDesignColorBundle);
app.delete('/deleteDesignColorBundle', [verificaToken, verificaAdminRol], deleteDesignColorBundle);
app.get('/getAllDesignColorBundle', [verificaToken, verificaAdminRol], getAllDesignColorBundle);

module.exports = app;


