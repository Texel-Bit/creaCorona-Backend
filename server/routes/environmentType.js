// Importa Express
const express = require('express');

// Crea una instancia de Router de Express
const app = express.Router();

// Importa los controladores que manejan las peticiones a las rutas
const { createEnvironmentType,
    createDesignTypeEnvironmentType,
    updateEnvironmentType,
    getAllEnvironmentType,
    getDesignColorTypesByEnvironmentIdAndDesignType,
    addDesignColorTypeToEnvironmentType,
    createDesignTypeFormatSizeForEnvironmentType,
    deleteDesignTypeFormatSizeForEnvironmentType,
    getAllDesignTypeFormatSizeForEnvironmentType,
    deleteDesignType_EnvironmentType} = require('../controllers/environmentType');

// Importa los middlewares que se utilizan en las rutas
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const { validarArchivoImagen } = require('../middlewares/validar-archivo');

// Define las rutas con los controladores correspondientes y los middlewares necesarios
app.post('/createEnvironmentType', [verificaToken, verificaAdminRol], createEnvironmentType);
app.post('/updateEnvironmentType', [verificaToken, verificaAdminRol], updateEnvironmentType);
app.get('/getAllEnvironmentType', getAllEnvironmentType);
app.post('/getDesignColorTypesByEnvironmentIdAndDesignType', getDesignColorTypesByEnvironmentIdAndDesignType);
app.post('/addDesignColorTypeToEnvironmentType',[verificaToken, verificaAdminRol], addDesignColorTypeToEnvironmentType);
app.post('/createDesignTypeFormatSizeForEnvironmentType',[verificaToken, verificaAdminRol], createDesignTypeFormatSizeForEnvironmentType);
app.post('/deleteDesignTypeFormatSizeForEnvironmentType',[verificaToken, verificaAdminRol], deleteDesignTypeFormatSizeForEnvironmentType);
app.post('/getAllDesignTypeFormatSizeForEnvironmentType', getAllDesignTypeFormatSizeForEnvironmentType);
app.post('/deleteDesignTypeEnvironmentType',[verificaToken, verificaAdminRol], deleteDesignType_EnvironmentType);
app.post('/createDesignTypeEnvironmentType',[verificaToken, verificaAdminRol], createDesignTypeEnvironmentType);


// Exporta el Router de Express
module.exports = app;
