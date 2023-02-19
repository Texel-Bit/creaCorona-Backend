const express = require('express')


const app = express()


app.use(require('./sysUser'));
app.use(require('./category'));
app.use(require('./product'));
app.use(require('./userRole'));
app.use(require('./background'));

app.use(require('./backgroundsocket'));
app.use(require('./backgrounddesing'));








module.exports = app;