const Category = require("../models/category");

const jwt = require('jsonwebtoken');
const date = require('date-and-time');
const axios = require('axios');
var fs = require("fs");
const { subirArchivoImagen } = require("../helpers/subirarchivos");


exports.updateCategoryImageURL = async (req, res) => {
    if (!req.body) {
      res.status(400).json({
        status: "error",
        error: "error en body!",
      });
      return;
    }
  
    try {
      var pacthcompleto = await subirArchivoImagen(
        req.files,
        ["jpg", "png", "jpeg"],
        "uploads/categories"
      );
    } catch (msg) {
      res.status(400).json({
        status:false,
        msg });
    }
  
    const categories = {
      idcategory: req.body.idcategory,
      categoryImageURL: pacthcompleto,
    };
    Category.getCategoryByIdCategory(categories, (err, data) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        try {
          if (
            fs.existsSync(process.cwd() + "\\" + data[0].categoryImageURL)
          ) {
            fs.unlinkSync(process.cwd() + "\\" + data[0].categoryImageURL);
            updateUrl();
          } else {
            updateUrl();
          }
        } catch (err) {
          console.error("Something wrong happened removing the file", err);
        }
  
        function updateUrl() {
          Category.updateCategoryImageURL(categories, (err, data) => {
            if (err)
              res.status(500).send({
                message: err.message,
              });
            else {
              res.json({
                status: true,
              });
            }
          });
        }
      }
    });
  };
exports.updateAllCategoryByVTEX =async (req, res) => {

var categories;
axios.get(process.env.URLVTEX+'catalog/pvt/category/', {
    headers: {
      'X-VTEX-API-AppKey': process.env.AppKeyVTEX,
      'X-VTEX-API-AppToken': process.env.AppTokenVTEX,

    }
  })
.then(response => {
    this.categories = response.data.Data ;
    Category.updateAllCategoryByVTEX(this.categories,(err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
 
            res.status(200).send({
                message: true
            });
        }

    });
})
.catch(e => {
    // Podemos mostrar los errores en la consola
    console.log(e);
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }
})  


};


exports.getAllSubCategory = (req, res, next) => {

    Category.getAllSubCategory((err, data) => {


        if (err)
            res.status(500).send({
                message: err.message 
            });
        else {
    

            res.json({
                status: true,
                data
            });
        }



    });


};
exports.getAllCategory = (req, res, next) => {

    Category.getAllCategory((err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the userTypeCompanyUser."
            });
        else {
    

            res.json({
                status: true,
                data
            });
        }



    });


};

// exports.createProductCategory = (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }


//     // Create a Customer
//     const productCategory = new ProductCategory({

//         nameProductCategory: req.body.nameProductCategory,
//     });

//     ProductCategory.createProductCategory(productCategory, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);

//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });


// };

// exports.getProductCategoryById = (req, res) => {
//     // Validate request

//     //console.log(req.body);
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }


//     // Create a Customer
//     const productCategoryById = new ProductCategory({
//         idproductCategory: req.body.idproductCategory,

//     });

//     ProductCategory.getProductCategoryById(productCategoryById, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);

//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });


// };

// exports.testgoogle = async (req, res, next) => {

//     var keyFilename = "server/client.json"; // Get this from Google Cloud -> Credentials -> Service Accounts
//     let projectId = "pgirs-350016"; // Get this from Google Cloud

//     const storage = new Storage({
//         keyFilename,
//         projectId

//     });
//     /**
//      * TODO(developer): Uncomment the following lines before running the sample.
//      */
//     // The ID of your GCS bucket
//     const bucketName = 'example_mudi';

//     // The path to your file to upload
 
// }

// exports.updateProductCategoryById = (req, res, next) => {
//     const productCategory = new ProductCategory({
//         idproductCategory: req.body.idproductCategory,
//         nameProductCategory: req.body.nameProductCategory,

//     });

//     ProductCategory.updateProductCategoryById(productCategory, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);

//             res.json({
//                 status: true,
//                 data
//             });
//         }



//     });


// };


// exports.getProductsCategoriesByCompany = (req, res, next) => {

//     ProductCategory.getProductsCategoriesByCompany(req.body.idcompany, (err, data) => {


//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             // let token = jwt.sign({
//             //     user: user,
//             // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

//             // res.setHeader('token', token);

//             res.json({
//                 status: true,
//                 data
//             });
//         }



//     });


// };