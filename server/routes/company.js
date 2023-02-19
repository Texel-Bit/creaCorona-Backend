// const express = require('express')
// const company = require("../controllers/company");

// // const bcrypt = require('bcrypt');
// const _ = require('underscore');

// const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
// const app = express()





// app.get("/company/getAllCompany",[verificaToken,verificaAdminRol], company.getAllCompany);

// app.get("/company/getAllCompanybyBrands",[verificaToken,verificaAdminRol], company.getAllCompanybyBrands);

// app.post("/company/createCompany",[verificaToken,verificaAdminRol], company.createCompany);
// app.post("/company/getCompanyById", [verificaToken,verificaAdminRol],company.getCompanyById);
// app.post("/company/updateInfoCompanyById",[verificaToken,verificaAdminRol], company.updateInfoCompanyById);
// app.post("/company/activeCompanyById", [verificaToken,verificaAdminRol],company.activeCompanyById);
// app.post("/company/inactiveCompanyById",[verificaToken,verificaAdminRol] ,company.inactiveCompanyById);
// app.post("/company/filterCompanies",[verificaToken,verificaAdminRol] ,company.filterCompanies);
// app.post("/company/getBrandsByCompany",[verificaToken,verificaAdminRol], company.getBrandsByCompany);

// module.exports = app;