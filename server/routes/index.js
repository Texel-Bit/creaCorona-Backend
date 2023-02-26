const express = require('express')
const sysUserRoutes = require('./sysUser');
const companyRoutes = require('./company');
const desingTypeRoutes = require('./designType');
const brechaRoutes = require('./brecha');
const designColorsRoutes = require('./designColors');
const designTypeFormatSizeRoutes = require('./designTypeFormatSize');
const designRoutes = require('./design');
const formatSizeTextureRoutes = require('./formatSizeTexture');
const environmentTypeRoutes = require('./environmentType');
const environmentRoutes = require('./environment');
const designCompanyRoutes = require('./designCompany');



const app = express()


app.use('/sysUser', sysUserRoutes);
app.use('/company', companyRoutes);
app.use('/desingType', desingTypeRoutes);
app.use('/brecha', brechaRoutes);
app.use('/designColors', designColorsRoutes);
app.use('/designTypeFormatSize', designTypeFormatSizeRoutes);

app.use('/design', designRoutes);
app.use('/formatSizeTexture',formatSizeTextureRoutes);

app.use('/environmentType',environmentTypeRoutes);

app.use('/environment',environmentRoutes);
app.use('/designCompany',designCompanyRoutes);




// app.use(require('./company'));
// app.use(require('./product'));
// app.use(require('./userRole'));
// app.use(require('./background'));

// app.use(require('./backgroundsocket'));
// app.use(require('./backgrounddesing'));








module.exports = app;