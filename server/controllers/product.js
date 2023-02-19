const Product = require("../models/product");

const axios = require("axios");
const { subirArchivoImagen } = require("../helpers/subirarchivos");

const jwt = require("jsonwebtoken");

const Category = require("../models/category");
var fs = require("fs");

exports.getProudctByCategory = (req, res) => {
  if (!req.body) {
    res.status(400).json({
      status: "error",
      error: "tbl_user_type_description Content can not be empty!",
    });
    return;
  }

  // Create a Customer

  Product.getProudctByCategory(req.body.idcategory, async (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the userTypeCompanyUser.",
      });
    else {
      data.forEach(async (element, index) => {
        const url = `https://api.vtex.com/whirlpoolcol/pricing/prices/${element.product_idproduct}`;
        try {
          var prices = await axios.get(url, {
            headers: {
              "X-VTEX-API-AppKey": process.env.AppKeyVTEX,
              "X-VTEX-API-AppToken": process.env.AppTokenVTEX,
            },
          });
          data[index].listPrice = prices.data.listPrice;
          data[index].basePrice = prices.data.basePrice;
        } catch (error) {}
      });

      await categories();

      async function categories() {
        await data.forEach((element, index) => {
          Category.getAllSubCategoryByIdProduct(
            element.product_idproduct,
            async (err, subcategories) => {
              if (err)
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while creating the userTypeCompanyUser.",
                });

              if (subcategories == null) {
              } else {
                // data[index].price = 10000;

                data[index].categroies = subcategories;

                if (data.length == index + 1) {
                  res.status(200).json({
                    status: "ok",
                    data,
                  });
                }
              }
            }
          );

          // console.log(data);
        });
      }
    }
  });
};

exports.updateAllProductByVTEX = async (req, res) => {
  var products;
  var from = 1;
  var to = 250;
  var informacion = [];
  var valor = 1;

  while (valor != 0) {
    try {
      products = await axios.get(
        process.env.URLVTEX +
          `catalog_system/pvt/products/GetProductAndSkuIds?_from=${from}&_to=${to}`,
        {
          headers: {
            "X-VTEX-API-AppKey": process.env.AppKeyVTEX,
            "X-VTEX-API-AppToken": process.env.AppTokenVTEX,
          },
        }
      );
    } catch (error) {
      res.status(400).json({
        status: "error",
        error: error,
      });
      return;
    }
    if (Object.keys(products.data.data).length == 0) {
      valor = 0;
    } else {
      informacion = Object.assign(informacion, products.data.data);
      // }

      from = from + 250;
      to = to + 250;
    }
  }

  try {
    var ids = [];

    for (var key in informacion) {
      if (informacion[key].length > 0) {
        informacion[key].forEach((element) => {
          ids.push(element);
        });
      } else {
      }
    }

    if (ids.length > 0) {
      Product.deteleAllProductoCategory((err, dataRes) => {
        if (err) {
          res.status(500).send({
            message: err.message || "no se crear",
          });
        } else {
          ids.forEach(async function (data, index) {
            const datos = await axios.get(
              process.env.URLVTEX +
                "catalog_system/pvt/sku/stockkeepingunitbyid/" +
                data,
              {
                headers: {
                  "X-VTEX-API-AppKey": process.env.AppKeyVTEX,
                  "X-VTEX-API-AppToken": process.env.AppTokenVTEX,
                },
              }
            );

            var categories = [];
            for (var key in datos.data.ProductCategories) {
              categories.push(key);
            }

            const productDetail = {
              idproduct: data,
              productName: datos.data.ProductName,
              productDescription: datos.data.ProductDescription,
              productSKU: datos.data.SkuName,
              productStatus_idproductStatus: null,
            };

            if (datos.data.Images.length == 0) {
              productDetail.productVTEXImageURL = "Sin imagen";
            } else {
              productDetail.productVTEXImageURL = datos.data.Images[0].ImageUrl;
            }

            if (datos.data.IsActive == true) {
              productDetail.productStatus_idproductStatus = 1;
            } else {
              {
                productDetail.productStatus_idproductStatus = 2;
              }
            }
            Product.getProductByIdProduct(productDetail, (err, data) => {
              if (err) {
                res.status(500).send({
                  message: err.message,
                });
              } else {
                if (data > 0 || data.length) {
                  Product.updateProductByIdProduct(
                    productDetail,
                    (err, data) => {
                      if (err) {
                        res.status(500).send({
                          message: err.message,
                        });
                      } else {
                        createCategories();
                      }
                    }
                  );
                } else {
                  Product.createProductByIdProduct(
                    productDetail,
                    (err, data) => {
                      if (err) {
                        res.status(500).send({
                          message: err.message,
                        });
                      } else {
                        createCategories();
                      }
                    }
                  );
                }
              }
              function createCategories(data) {
                categories.forEach(function (category, index) {
                  const productCategory = {
                    product_idproduct: productDetail.idproduct,
                    category_idcategory: parseInt(category),
                  };
                  Product.updateProductoCategory(
                    productCategory,
                    (err, data) => {
                      if (err)
                        res.status(500).send({
                          message: err.message || "no se crear",
                        });
                      else {
                      }
                    }
                  );
                });
              }
            });
          });
        }
      });
    }
    res.json({
      status: "ok",
    });
  } catch (error) {
    res.status(400).json({
      status: "error",
      error: error,
    });
    return;
  }
};

exports.getAllProducts = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).json({
      status: "error",
      error: "no se logro crear",
    });
    return;
  }
  let token = req.get("JWT");
  jwt.verify(token, process.env.SEED, (err, decode) => {
    if (err) {
      res.status(500).send({
        message: err,
      });
    }
  });

  Product.getAllProducts((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "no se pudo consultar",
      });
    else {
      data.forEach((element, index) => {
        Product.getAllCategoriesByIdProduct(element, (err, subCategories) => {
          if (err)
            res.status(500).send({
              message: err.message || "no se pudo consultar",
            });
          else {
            if (subCategories) {
              data[index].SubCategories = subCategories;
            }

            if (index == data.length - 1) {
              res.json({
                status: true,
                data,
              });
            }
          }
        });
      });
    }
  });
};

exports.updateProductCustomImageURL = async (req, res) => {
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
      "uploads/products"
    );
  } catch (msg) {
    res.status(400).json({ msg });
  }

  const product = {
    idproduct: req.body.idproduct,
    productCustomImageURL: pacthcompleto,
  };
  Product.getProductByIdProduct(product, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      try {
        if (
          fs.existsSync(process.cwd() + "\\" + data[0].productCustomImageURL)
        ) {
          fs.unlinkSync(process.cwd() + "\\" + data[0].productCustomImageURL);
          updateUrl();
        } else {
          updateUrl();
        }
      } catch (err) {
        console.error("Something wrong happened removing the file", err);
      }

      function updateUrl() {
        Product.updateProductCustomImageURL(product, (err, data) => {
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
// exports.createProduct = async (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }

//     // Create a Customer
//     const product = new Product({
//         sku: req.body.sku,
//         nameProduct: req.body.nameProduct,
//         thumbnail: req.body.thumbnail,
//         description: req.body.description,
//         etiquetas: req.body.etiquetas,
//         initialModelUrl: req.body.initialModelUrl,
//         glbModelUrl: req.body.glbModelUrl,
//         usdzModelUrl: req.body.usdzModelUrl,
//         productCategory_idproductCategory: req.body.productCategory_idproductCategory,
//         productStatus_idproductStatus: 2,
//         creationDate: new Date(),
//         project_idproject: req.body.project_idproject,
//         company_idcompany: req.body.company_idcompany,
//         status: 1

//     });

//     if (!req.files.glbModelUrl && !req.files.usdzModelUrl) {
//         res.status(400).json({
//             status: 'error',
//             error: 'Falta archivo archivo 3d',
//         });
//         return;
//     }
//     const company = new Company({

//         idcompany: req.body.company_idcompany,
//     });

//     Company.getCompanyById(company, async (err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             console.log(req.files);
//             if (req.files.thumbnail) {
//                 try {
//                     var pacthcompleto = await subirArchivoThumbnail(
//                         req.files, ['jpg', 'png', 'jpeg'],
//                         `applications/${data.prefixPath}/public_html/${product.sku}`
//                     );
//                     product.thumbnail = pacthcompleto;

//                 } catch (msg) {
//                     console.log(msg);
//                 }

//             }
//             if (req.files.glbModelUrl) {
//                 try {
//                     var pacthcompletoglbModelUrl = await subirArchivoglb(
//                         req.files, ["glb"],
//                         `applications/${data.prefixPath}/public_html/${product.sku}`
//                     );
//                     product.glbModelUrl = pacthcompletoglbModelUrl;

//                 } catch (msg) {
//                     //  res.status(400).json({ msg });
//                 }

//             }
//             if (req.files.usdzModelUrl) {
//                 try {
//                     var pacthcompletousdzModelUrl = await subirArchivousdz(
//                         req.files, ["usdz"],
//                         `applications/${data.prefixPath}/public_html/${product.sku}`
//                     );
//                     product.usdzModelUrl = pacthcompletousdzModelUrl;
//                 } catch (msg) {
//                     //  res.status(400).json({ msg });
//                 }
//             }

//             Product.createProduct([product, req.body.marcaId, req.body.company_idcompany], async (err, data) => {

//                 if (err) {
//                     await res.status(400).send({
//                         message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//                     });
//                 }

//                 else {
//                     //console.log("ingreso al else");
//                     await res.status(200).json({
//                         status: true,
//                         data
//                     });

//                 }
//             });

//         }

//     });

// };

// exports.getProductById = (req, res) => {
//     let token = req.get('JWT');
//     jwt.verify(token, process.env.SEED, (err, decode) => {

//         if (err) {
//             res.status(500).send({
//                 message: err
//             });

//         }

//         //console.log(decode);

//         company_idcompany = decode.user.company_idcompany;

//     });

//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }

//     // Create a Customer
//     const productById = new Product({
//         idproduct: req.body.idproduct,

//     });

//     Product.getProductById([productById, company_idcompany], (err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             //console.log("error");

//             res.status(200).json({
//                 status: true,
//                 data
//             });
//         }
//     });

// };
// exports.updateProductById = (req, res, next) => {
//     const product = new Product({
//         idproduct: req.body.idproduct,
//         nameProduct: req.body.nameProduct,
//         description: req.body.description,
//         etiquetas: req.body.etiquetas,
//         productCategory_idproductCategory: req.body.productCategory_idproductCategory,
//         project_idproject: req.body.project_idproject
//     });

//     Product.updateProductById(product, (err, data) => {

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

// exports.updateStatusProductById = (req, res, next) => {
//     const product = new Product({
//         idproduct: req.body.idproduct,
//         productStatus_idproductStatus: req.body.productStatus_idproductStatus,
//     });

//     Product.updateStatusProductById(product, (err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.json({
//                 status: true,
//                 data
//             });
//         }

//     });

// };

// exports.activeProductById = (req, res, next) => {

//     Product.activeProductById(req.body, (err, data) => {

//         res.json({
//             status: true,
//             user: data,

//         });

//     });

// }

// exports.inactiveProductById = (req, res, next) => {

//     Product.inactiveProductById(req.body, (err, data) => {

//         res.json({
//             status: true,
//             user: data,

//         });

//     });

// }

// exports.getAllProductStatus = (req, res) => {
//     let token = req.get('JWT');
//     jwt.verify(token, process.env.SEED, (err, decode) => {

//         if (err) {
//             res.status(500).send({
//                 message: err
//             });

//         }

//         //console.log(decode);

//     });

//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }

//     // Create a Customer

//     Product.getAllProductStatus((err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             //console.log("error");

//             res.status(200).json({
//                 status: true,
//                 data
//             });
//         }
//     });

// };

// exports.filterProducts = (req, res, next) => {
//     const filtros = ({
//         idcompany: req.body.idcompany,
//         idbrand: req.body.idbrand,
//         idfase: req.body.idfase,
//         idstatus: req.body.idstatus,
//     });

//     Product.filterProducts(filtros, (err, data) => {

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

// exports.updatePrudctModelsById = async (req, res) => {
//     // Validate request
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }
//     // Create a Customer
//     const product = new Product({

//         glbModelUrl: req.body.glbModelUrl,
//         usdzModelUrl: req.body.usdzModelUrl,
//         productCategory_idproductCategory: req.body.productCategory_idproductCategory,
//         sku: req.body.sku,
//         project_idproject: req.body.project_idproject,
//         company_idcompany: req.body.company_idcompany,

//     });
//     console.log(req.files, "451");

//     if (!req.files) {
//         res.status(400).json({
//             status: 'error',
//             error: 'Falta archivo archivo 3d',
//         });
//         return;
//     }
//     const company = new Company({

//         idcompany: req.body.company_idcompany,
//     });
//     console.log(req.body);

//     Company.getCompanyById(company, async (err, data) => {
//         console.log(data);
//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             if (req.files) {

//                 if (req.files.glbModelUrl) {
//                     try {
//                         var pacthcompletoglbModelUrl = await subirArchivoglb(
//                             req.files, ["glb"],
//                             `applications/${data.prefixPath}/public_html/${product.sku}`
//                         );
//                         product.glbModelUrl = pacthcompletoglbModelUrl;
//                     } catch (msg) {
//                         res.status(400).json({ msg });
//                     }

//                 }
//                 if (req.files.usdzModelUrl) {
//                     try {
//                         var pacthcompletousdzModelUrl = await subirArchivousdz(
//                             req.files, ["usdz"],
//                             `applications/${data.prefixPath}/public_html/${product.sku}`
//                         );
//                         product.usdzModelUrl = pacthcompletousdzModelUrl;
//                     } catch (msg) {
//                         res.status(400).json({ msg });
//                     }
//                 }

//                 await res.status(200).json({
//                     status: true,
//                     msg: 'Se actualizaron los archivos seleccionados'

//                 });

//             } else {
//                 await res.status(200).json({
//                     status: true,
//                     msg: 'No se econtraron archivos para actualizar'

//                 });
//             }
//         }
//     });

// };

// exports.getProductsUrl = (req, res, next) => {
//     const user = new User({
//         email: req.headers.email,
//         password: req.headers.password,

//     });

//     User.findOneLogin(user, (err, data) => {

//         let now = new Date();
//         now.setDate(now.getDate());
//         const fecha = date.format(now, 'YYYY-MM-DD HH:mm:ss');
//         // data.TmpPasswordExpireDate = date.format(data.TmpPasswordExpireDate, 'YYYY-MM-DD HH:mm:ss');

//         if (err)
//             res.status(500).send({
//                 message: "Some error occurred while creating the userTypeCompanyUser."
//             });

//         if (data == undefined) {

//             return res.status(200).json({
//                 status: 'false',
//                 err: {
//                     message: 'clave invalida'
//                 }
//             })

//         }

//         if (!bcrypt.compareSync(user.password, data.password)) {

//             return res.status(200).json({
//                 status: 'false',
//                 err: {
//                     message: 'clave invalida'
//                 }
//             })

//         } else {
//             skus = req.body.skus
//             skus = JSON.stringify(skus);
//             skus = skus.replace("[", "");
//             skus = skus.replace("]", "");

//             const valor = ({
//                 skus,
//                 company: data.company_idcompany,

//             });

//             if (data.TokenAPI == req.headers.tokenapi) {
//                 Product.getProductsUrl(valor, (err, data) => {

//                     if (err)
//                         res.status(500).send({
//                             message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//                         });
//                     else {

//                         var respuesta = [];

//                         data.forEach(valor => {

//                             var datos = ({
//                                 NAME: valor.nameProduct,
//                                 SKU: valor.sku,
//                                 URLWEB: `https://viewer.mudi.com.co/v1/web/?id=${valor.idcompany}&sku=${valor.sku}`,
//                                 URLAR: `https://viewer.mudi.com.co/v1/ar/?id=${valor.idcompany}&sku=${valor.sku}`,
//                                 URLQR: `https://viewer.mudi.com.co/v1/qr/?id=${valor.idcompany}&sku=${valor.sku}`

//                             });
//                             respuesta.push(datos);
//                         });

//                         res.json({
//                             status: true,
//                             data: respuesta
//                         });
//                     }

//                 });

//             } else {

//                 res.json({
//                     status: 'false',
//                     data: 'Falta  Token o Token icorrecto'
//                 });
//             }

//         }

//     });

// };
// exports.getData3d = (req, res, next) => {

//     Product.getData3d((err, [tiempoPromedio, rankingtiempoPromedio, totalsesiones, rankingsesiones, click, ranking, grafica]) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             var fechas = [];
//             var sesiones = [];

//             var graficas1 = [];
//             var graficas2 = [];

//             grafica.forEach(element => {
//                 fechas.push(date.format(element.fecha, 'YY-MMM-DD'))
//                 sesiones.push(element.sesiones)
//             });

//             res.json({
//                 status: true,
//                 tiempoPromedio,
//                 rankingtiempoPromedio, totalsesiones, rankingsesiones, click, ranking, fechas, sesiones, graficas1, graficas2
//             });
//         }

//     });

// };

// exports.getDataqrar = (req, res, next) => {

//     Product.getDataqrar((err, [tiempoPromedio, rankingtiempoPromedio, totalsesionesar, rankingsesiones, click, ranking, grafica, grafica1, grafica2]) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             var fechas = [];
//             var sesiones = [];

//             var graficas1 = [];
//             var graficas2 = [];

//             grafica.forEach(element => {
//                 fechas.push(date.format(element.fecha, 'YY-MMM-DD'))
//                 sesiones.push(element.sesiones)
//             });

//             if (grafica1) {
//                 grafica1.forEach(element => {
//                     graficas1.push(element.sesiones)
//                 });
//             }
//             if (grafica2) {
//                 grafica2.forEach(element => {
//                     graficas2.push(element.sesiones)
//                 });
//             }

//             res.json({
//                 status: true,
//                 tiempoPromedio,
//                 rankingtiempoPromedio, totalsesionesar, rankingsesiones, click, ranking, fechas, sesiones, graficas1, graficas2
//             });
//         }

//     });

// };

// exports.getData = (req, res, next) => {
//     Product.getData((err, [totalsesiones3d, tiempoPromedio3d, totalclickss3d, tiempoPromedioar, totalsesionesarmobile, totalsesionesarpc, graficofull, grafico3d, graficoar]) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {
//             var fechasfull = [];
//             var fechas3d = [];
//             var fechasar = [];

//             var datosgrafica = [];
//             var datosgrafica3d = []
//             var datosgraficaar = []

//             grafico3d.forEach(element => {
//                 // fechas3d.push(date.format(element.fecha, 'YY-MMM-DD'))
//                 let fecha = date.format(element.fecha, 'YY-MMM-DD')
//                 fechas3d.push({ "fecha": fecha, "sesiones": element.sesiones })

//                 // datosgrafica3d.push(element.sesiones)
//             });

//             graficoar.forEach(element => {
//                 // fechas3d.push(date.format(element.fecha, 'YY-MMM-DD'))
//                 let fecha = date.format(element.fecha, 'YY-MMM-DD')
//                 fechasar.push({ "fecha": fecha, "sesiones": element.sesiones })

//                 // datosgrafica3d.push(element.sesiones)
//             });
//             graficofull.forEach(element => {

//                 fechasfull.push(date.format(element.fecha, 'YY-MMM-DD'))

//                 datosgrafica.push(element.sesiones)

//             });

//             for (let index = 0; index < graficofull.length; index++) {

//                 let datos = fechas3d.find(el => el.fecha === fechasfull[index]);

//                 if (datos == undefined) {
//                     datosgrafica3d.push(0)
//                 } else {
//                     datosgrafica3d.push(datos.sesiones)
//                 }

//                 let datosar = fechasar.find(el => el.fecha === fechasfull[index]);

//                 if (datosar == undefined) {
//                     datosgraficaar.push(0)
//                 } else {
//                     datosgraficaar.push(datosar.sesiones)
//                 }

//             }

//             res.json({
//                 status: true,
//                 totalsesiones3d,
//                 tiempoPromedio3d,
//                 totalsesionesarmobile,
//                 totalclickss3d,
//                 tiempoPromedioar,
//                 totalsesionesarpc,
//                 datosgrafica,
//                 datosgrafica3d,
//                 datosgraficaar,
//                 fechasfull
//             });
//         }

//     });

// };

// exports.filterProductsDashboard = (req, res, next) => {
//     const filtros = ({
//         idcompany: req.body.idcompany,
//         idbrand: req.body.idbrand,
//         idcategory: req.body.idcategory,
//     });

//     Product.filterProductsDashboard(filtros, (err, data) => {

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

// exports.productRequest = async (req, res, next) => {
//     const filtros = ({
//         idcompany: req.body.idcompany,
//         idbrand: req.body.idbrand,
//         idcategory: req.body.idcategory,
//     });

//     let token = req.get('JWT');
//     jwt.verify(token, process.env.SEED, (err, decode) => {

//         if (err) {
//             res.status(500).send({
//                 message: err
//             });

//         }

//         company_idcompany = decode.user.company_idcompany;

//     });
//     var pacthcompleto = '';

//     var usuariosfinal = [];
//     try {
//         pacthcompleto = await subirArchivo(req.files, ['xlsx'], 'productos');
//     } catch (msg) {
//         res.status(400).json({ msg: "error file" });
//     }
//     readXlsxFile(fs.createReadStream(pacthcompleto)).then((rows) => {
//         usuariosfinal = rows
//         var nuevaData = [];
//         var arrayDeArrays = [];
//         var fila = 0
//         usuariosfinal.forEach(function (objeto) {
//            arrayDeArrays[fila] = [];
//             arrayDeArrays[fila].push(objeto[0]);
//             arrayDeArrays[fila].push(objeto[1]);
//             arrayDeArrays[fila].push(objeto[2]);
//                fila += 1;
//         });
//         arrayDeArrays.forEach(element => {
//             nuevaData.push({
//                 "sku": element[0],
//                 "productName": element[1],
//                 "productURL": element[2],
//                 "companyID": company_idcompany

//             })
//         });
//         nuevaData.shift();

//         for (let index = 0; index < nuevaData.length; index++) {
//             console.log(nuevaData[index], index);

//             Product.productRequest(nuevaData[index], (err, data) => {
//                 console.log(err,"error");
//                 console.log(data,"data");
//                 if (err)
//                     res.status(500).send({
//                         message: "Some error occurred while creating the userTypeCompanyUser."
//                     });

//             });

//         }
//         res.status(200).json({ message: true });

//     })
// };

// exports.getproductRequest = (req, res) => {
//     let token = req.get('JWT');
//     jwt.verify(token, process.env.SEED, (err, decode) => {

//         if (err) {
//             res.status(500).send({
//                 message: err
//             });

//         }

//         company_idcompany = decode.user.company_idcompany;

//     });

//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }

//     // Create a Customer

//     Product.getproductRequest(company_idcompany,(err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.status(200).json({
//                 status: true,
//                 data
//             });
//         }
//     });

// };

// exports.deleteProductOrders = (req, res) => {
//     let token = req.get('JWT');
//     jwt.verify(token, process.env.SEED, (err, decode) => {

//         if (err) {
//             res.status(500).send({
//                 message: err
//             });

//         }

//         company_idcompany = decode.user.company_idcompany;

//     });

//     const product = ({

//         idProductOrders: req.body.idProductOrders,
//             company_idcompany,

//     });
//     if (!req.body) {
//         res.status(400).json({
//             status: 'error',
//             error: 'tbl_user_type_description Content can not be empty!',
//         });
//         return;

//     }

//     // Create a Customer

//     Product.deleteProductOrders(product,(err, data) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.status(200).json({
//                 status: true,
//                 data
//             });
//         }
//     });

// };

// exports.getTotalVistas = (req, res, next) => {
// // console.log(req.body);

// const filtros= req.body.tipo;
// const fechas= req.body.fechas;

// Product.getTotalVistas([filtros,fechas],(err,totalsesiones) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.json({
//                 status: true,
//                 totalsesiones,

//             });
//         }

//     });

// };

// exports.getAVGTime = (req, res, next) => {

//     const filtros= req.body.tipo;
//     const fechas= req.body.fechas;

//     Product.getAVGTime([filtros,fechas],(err,tiempoPromedio) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.json({
//                 status: true,
//                 tiempoPromedio,

//             });
//         }

//     });

// };
// exports.getClicks = (req, res, next) => {
//     const filtros= req.body.tipo;
//     const fechas= req.body.fechas;

//     Product.getClicks([filtros,fechas],(err,clicks) => {

//         if (err)
//             res.status(500).send({
//                 message: err.message || "Some error occurred while creating the userTypeCompanyUser."
//             });
//         else {

//             res.json({
//                 status: true,
//                 clicks,

//             });
//         }

//     });

// };

// exports.filtersProductsId = (req, res, next) => {
//     const filtros = ({
//         idcompany: req.body.idcompany,
//         idcategory: req.body.idcategory,
//         idbrand: req.body.idbrand,
//         idproduct:req.body.idproduct
//     });

//     Product.filtersProductsId(filtros, (err, data) => {
// var arr=[];
// data.forEach(element => {
//     arr.push(element.idproduct)
// });

// if (data.length==0) {
//     arr=[];
// }
// arr=arr;

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
//                 data:arr
//             });
//         }

//     });

// };
