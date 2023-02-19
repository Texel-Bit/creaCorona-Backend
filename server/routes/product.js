const express = require('express')
const product = require("../controllers/product");
const { validarArchivoSubir } = require('../middlewares/validar-archivo');

const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion');
const app = express()


app.get("/product/updateAllProductByVTEX", product.updateAllProductByVTEX);
app.post("/product/getProudctByCategory", product.getProudctByCategory);
app.post("/product/getAllProducts", product.getAllProducts);
app.post("/product/updateProductCustomImageURL",[validarArchivoSubir,verificaAdminRol], product.updateProductCustomImageURL);



// app.get("/product/getAllProduct",[verificaToken], product.getAllProduct);
// app.post("/product/createProduct",[verificaToken,verificaAdminRol],product.createProduct);
// app.post("/product/getProductById",[verificaToken], product.getProductById);
// app.post("/product/updateProductById",[verificaToken,verificaAdminRol], product.updateProductById);
// app.post("/product/updateStatusProductById",[verificaToken,verificaAdminRol], product.updateStatusProductById);
// app.post("/product/activeProductById", [verificaToken,verificaAdminRol],product.activeProductById);
// app.post("/product/inactiveProductById",[verificaToken,verificaAdminRol] ,product.inactiveProductById);
// app.post("/product/inactiveProductById",[verificaToken,verificaAdminRol] ,product.inactiveProductById);
// app.post("/product/updatePrudctModelsById",[verificaToken,verificaAdminRol],product.updatePrudctModelsById);

// app.post("/product/filterProducts",[verificaToken,verificaAdminRol] ,product.filterProducts);
// app.post("/product/filterProductsDashboard",[verificaToken,verificaAdminRol] ,product.filterProductsDashboard);

// app.post("/product/getProductsUrl" ,product.getProductsUrl);


// app.get("/product/getAllProductStatus",[verificaToken,verificaAdminRol], product.getAllProductStatus);


// app.post("/product/getData3d", product.getData3d);
// app.post("/product/getDataqrar", product.getDataqrar);
// app.post("/product/getData",product.getData);



// app.post("/product/getTotalVistas",product.getTotalVistas);
// app.post("/product/getAVGTime",product.getAVGTime);

// app.post("/product/getClicks",product.getClicks);
// app.post("/product/filtersProductsId",product.filtersProductsId);



// app.post("/product/productRequest",[verificaToken] ,product.productRequest);
// app.get("/product/getproductRequest",[verificaToken] ,product.getproductRequest);
// app.post("/product/deleteProductOrders",[verificaToken] ,product.deleteProductOrders);



module.exports = app;