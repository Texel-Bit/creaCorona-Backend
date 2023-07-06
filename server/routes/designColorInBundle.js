// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createDesignColorInBundle,deleteDesignColorInBundle} = require('../controllers/designColorBundle');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
// const {  validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createDesignColorInBundle', [verificaToken, verificaAdminRol], createDesignColorInBundle);
// app.post('/updateDesignColorBundle', [verificaToken, verificaAdminRol], updateDesignColorBundle);
app.delete('/deleteDesignColorInBundle', [verificaToken, verificaAdminRol], deleteDesignColorInBundle);
// app.get('/getAllDesignColorBundle', [verificaToken, verificaAdminRol], getAllDesignColorBundle);
// app.post('/getAllDesignColorBundleByFilters', [verificaToken, verificaAdminRol],getAllDesignColorBundleByFilters);

module.exports = app;




DesignColorInBundle