const express = require('express')
const sysUserRoutes = require('./sysUser');
const companyRoutes = require('./company');


const app = express()


app.use('/sysUser', sysUserRoutes);
app.use('/company', companyRoutes);

// app.use(require('./company'));
// app.use(require('./product'));
// app.use(require('./userRole'));
// app.use(require('./background'));

// app.use(require('./backgroundsocket'));
// app.use(require('./backgrounddesing'));








module.exports = app;