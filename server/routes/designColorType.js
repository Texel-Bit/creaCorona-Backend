// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { getAllDesignColorType,createDesignColorTypehasDesignType, deleteDesignColorTypehasDesignType} = require('../controllers/designColorType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');

app.get('/getAllDesignColorType', [verificaToken, verificaAdminRol], getAllDesignColorType);
app.post('/createDesignColorTypehasDesignType', [verificaToken, verificaAdminRol], createDesignColorTypehasDesignType);
app.post('/deleteDesignColorTypehasDesignType', [verificaToken, verificaAdminRol], deleteDesignColorTypehasDesignType);




 
// Exporta el Router de Express
module.exports = app;
