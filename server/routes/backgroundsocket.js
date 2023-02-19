const express = require('express')


const backgroundsocket = require('../controllers/backgroundsocket');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express()
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
 


app.post("/backgroundsocket/createBackgroundSocket", [verificaToken,verificaAdminRol],backgroundsocket.createBackgroundSocket);
app.post("/backgroundsocket/updateBackgroundSocket", [verificaToken,verificaAdminRol],backgroundsocket.updateBackgroundSocket);
app.post("/backgroundsocket/createBackgroundSocketForCategory", [verificaToken,verificaAdminRol],backgroundsocket.createBackgroundSocketForCategory);
app.post("/backgroundsocket/deleteBackgroundSocket", [verificaToken,verificaAdminRol],backgroundsocket.deleteBackgroundSocket);

app.post("/backgroundsocket/getAllBackgroundSocket",[verificaToken], backgroundsocket.getAllBackgroundSocket);
// app.post("/backgroundsocket/getAllBackgroundSocketByBackground",[verificaToken], backgroundsocket.getAllBackgroundSocketByBackground);


module.exports = app;