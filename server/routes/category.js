const express = require('express')
const category = require("../controllers/category");

// const bcrypt = require('bcrypt');
const _ = require('underscore');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express()





app.get("/category/updateAllCategoryByVTEX", category.updateAllCategoryByVTEX);
app.get("/category/getAllCategory", category.getAllCategory);
app.get("/category/getAllSubCategory", category.getAllSubCategory);
app.post("/category/updateCategoryImageURL",[validarArchivoSubir,verificaAdminRol], category.updateCategoryImageURL);





// app.post("/category/createProductCategory", [verificaToken,verificaAdminRol],productcategory.createProductCategory);
// app.post("/category/getProductCategoryById",[verificaToken,verificaAdminRol], productcategory.getProductCategoryById);
// app.post("/category/updateProductCategoryById",[verificaToken,verificaAdminRol], productcategory.updateProductCategoryById);

// app.post("/productcategory/getProductsCategoriesByCompany",[verificaToken,verificaAdminRol], productcategory.getProductsCategoriesByCompany);

// app.post("/productcategory/testgoogle", productcategory.testgoogle);



module.exports = app;