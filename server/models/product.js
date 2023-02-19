const sql = require("./db.js");

const Product = function (product) {
  this.idproduct = product.idproduct;
  this.sku = product.sku;
  this.nameProduct = product.nameProduct;
  this.thumbnail = product.thumbnail;
  this.description = product.description;
  this.etiquetas = product.etiquetas;
  this.initialModelUrl = product.initialModelUrl;
  this.glbModelUrl = product.glbModelUrl;
  this.usdzModelUrl = product.usdzModelUrl;
  this.productCategory_idproductCategory =
    product.productCategory_idproductCategory;
  this.productStatus_idproductStatus = product.productStatus_idproductStatus;
  this.creationDate = product.creationDate;
  this.project_idproject = product.project_idproject;
  this.status = product.status;
};


Product.updateProductCustomImageURL = (product, result) => {

  sql.query(
    "update  product SET productCustomImageURL=? where idproduct=?",
    [
      product.productCustomImageURL,
 
      product.idproduct,
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res == "") {
        result(null, res);
        return;
      }

      console.log(res);
      result(null, res);
    }
  );
};
Product.getProductByIdProduct = (data, result) => {
  sql.query(
    "SELECT * FROM product WHERE idproduct =?",
    [data.idproduct],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res == "") {
        result(null, res);
        return;
      }

      result(null, res);
    }
  );
};
Product.updateProductByIdProduct = (data, result) => {
  consulta = `update  product SET productName='${data.productName}',productDescription='${data.productDescription}',productVTEXImageURL='${data.productVTEXImageURL}',productStatus_idproductStatus='${data.productStatus_idproductStatus}',productSKU='${data.productSKU}' where idproduct ='${data.idproduct}'`;
  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    if (res == "") {
      result(null, res);
      return;
    }
    result(null, res.message);
  });
};
Product.createProductByIdProduct = (data, result) => {
  sql.query("INSERT INTO  product SET ?", data, (err, res,fields) => {
    if (err) {
        result(err, null);
      return;
    }
    if (res == "") {
      result(null, res[0]);
      return;
    }

    result(null, res[0]);
  });
};

Product.updateProductoCategory = (data, result) => {
  sql.query(
    "INSERT INTO  product_has_category SET product_idproduct=?, category_idcategory=?",
    [data.product_idproduct, data.category_idcategory],
    (err, resp) => {
      if (err) {
        console.log(err);
        result(err, null);
        return;
      } else {
        result(null, resp);
      }
    }
  );

  result(null);
};

Product.deteleAllProductoCategory = (result) => {
  sql.query("DELETE from  product_has_category ", (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res.affectedRows);
    return;
  });
};

Product.createProduct = ([newproduct, marcaId, company_idcompany], result) => {
  sql.query("INSERT INTO product SET ?", newproduct, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      sql.query(
        "INSERT INTO  productOwner SET product_idproduct= ? ,company_idcompany =?",
        [res.insertId, marcaId],
        (err, resp) => {
          if (err) {
            result(err, null);
            return;
          }

          if (res == "") {
            result(null, resp[0]);
            return;
          }

          var consulta = `INSERT INTO mv_productos  (id, mv_proyectos_id, mv_clientes_id, sku, nombre, url_web, url_ar, url_qr, url_poster, url_iframe, url_glb, url_usdz, url_hdr) VALUES ('${res.insertId}','${newproduct.project_idproject}','${company_idcompany}','${newproduct.sku}','${newproduct.nameProduct}','https://viewer.mudi.com.co/v1/web?id=${newproduct.company_idcompany}&sku=${newproduct.sku}','https://viewer.mudi.com.co/v1/ar?id=${newproduct.company_idcompany}&sku=${newproduct.sku}','https://viewer.mudi.com.co/v1/qr?id=${newproduct.company_idcompany}&sku=${newproduct.sku}','https://viewer.mudi.com.co/v1/poster?id=${newproduct.company_idcompany}&sku=${newproduct.sku}','<iframe width="640" height="480" frameborder="0" src="https://viewer.mudi.com.co/v1/web?id=${newproduct.company_idcompany}&sku=${newproduct.sku}"></iframe>','https://viewer.mudi.com.co/v1/glb?id=${newproduct.company_idcompany}&sku=${newproduct.sku}',  'https://viewer.mudi.com.co/v1/usdz?id=${newproduct.company_idcompany}&sku=${newproduct.sku}','https://viewer.mudi.com.co/v1/hdr?id=${newproduct.company_idcompany}&sku=${newproduct.sku}');`;
          sqlant.query(consulta, (err, res) => {
            if (err) {
              result(err, null);
              return;
            }
          });
          result(null, resp[0]);
        }
      );
    }
  });
};

Product.getProudctByCategory = (data, result) => {
  const consulta = ` SELECT * FROM product_has_category
        INNER JOIN product
        ON product_has_category.product_idproduct = product.idproduct WHERE product_has_category.category_idcategory=${data}`;
  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.getAllProducts = (result) => {
  const consulta = ` SELECT * FROM product_has_category
  INNER JOIN product
  ON product_has_category.product_idproduct = product.idproduct GROUP BY idproduct`;

  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      result(null, res);
    }
  });
};

Product.getproductRequest = (company_idcompany, result) => {
  var consulta = "";

  if (company_idcompany == 11) {
    consulta =
      "SELECT * FROM  productOrders  INNER JOIN company ON company.idcompany=productOrders.companyID ";
  } else {
    consulta = `SELECT * FROM  productOrders  INNER JOIN company ON company.idcompany=productOrders.companyID WHERE companyID=${company_idcompany}; `;
  }

  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      result(null, res);
    }
  });
};

Product.deleteProductOrders = (data, result) => {
  var consulta = "";
  if (data.company_idcompany == 11) {
    consulta = ` DELETE FROM productOrders WHERE idProductOrders=${data.idProductOrders};`;
  } else {
    consulta = `DELETE FROM productOrders WHERE companyID=${data.company_idcompany} and idProductOrders=${data.idProductOrders}; `;
  }
  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    } else {
      result(null, res);
    }
  });
};


Product.updateStatusProductById = (product, result) => {
  sql.query(
    "update  product SET productStatus_idproductStatus=? where idproduct=?",
    [product.productStatus_idproductStatus, product.idproduct],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res == "") {
        result(null, res[0]);
        return;
      }

      result(null, res[0]);
    }
  );
};
Product.getAllCategoriesByIdProduct = (product, result) => {
  sql.query(
    "SELECT * FROM product_has_category  INNER JOIN category ON product_has_category.category_idcategory=category.idcategory WHERE product_idproduct=? AND categoryParentID IS null    ",
    [product.product_idproduct],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
    

      if (res) {
        
      result(null, res);
      }
return; 
    }
  );
};


Product.inactiveProductById = (product, result) => {
  sql.query(
    "update product set status=2  where idproduct =?",
    [product.idproduct],
    (err, res) => {
      //console.log(res);
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res == "") {
        result(null, res[0]);
        return;
      }

      result(null, res[0]);
    }
  );
};

Product.activeProductById = (product, result) => {
  sql.query(
    "update product set status=1  where idproduct =?",
    [product.idproduct],
    (err, res) => {
      //console.log(res);
      if (err) {
        //console.log("error: ", err);
        result(err, null);
        return;
      }
      if (res == "") {
        result(null, res[0]);
        return;
      }

      result(null, res[0]);
    }
  );
};

Product.getCompanyandProjectByIdproduct = (product, result) => {
  consulta = `SELECT * FROM product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN  company ON project.company_idcompany=company.idcompany   WHERE idproduct=${product.idproduct}  `;

  sql.query(consulta, product.idproduct, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res[0]);
  });
};

Product.getAllProductStatus = (result) => {
  consulta = `SELECT * FROM productStatus `;

  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.filterProducts = (filtros, result) => {
  consulta =
    "SELECT company.idcompany AS idBrand, company.nameCompany AS brand,t.* FROM( SELECT company.*, product.* , productCategory.*,productStatus.* FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus) t,company,productOwner WHERE company.idcompany=productOwner.company_idcompany and productOwner.product_idproduct=t.idproduct  ";

  if (
    filtros.idcompany != "" ||
    filtros.idbrand != "" ||
    filtros.idfase != "" ||
    filtros.idstatus != ""
  ) {
    if (filtros.idcompany != "") {
      consulta = `${consulta} and  t.idcompany=${filtros.idcompany} `;
    }

    if (filtros.idfase != "") {
      consulta = ` ${consulta}and  t.productStatus_idproductStatus=${filtros.idfase} `;
    }

    if (filtros.idstatus != "") {
      consulta = ` ${consulta}and  t.status=${filtros.idstatus} `;
    }

    if (filtros.idbrand != "") {
      consulta = `${consulta}   HAVING idBrand =${filtros.idbrand} `;
    }
  }
  console.log(consulta);
  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.getProductsUrl = (valor, result) => {
  if (valor.company == 11) {
    if (valor.skus) {
      consulta = `SELECT * FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus   WHERE sku in(${valor.skus})  `;
    } else {
      consulta = `SELECT * FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus   `;
    }
  } else {
    if (valor.skus) {
      consulta = `SELECT * FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus   WHERE sku in (${valor.skus}) and idcompany=${valor.company}`;
    } else {
      consulta = `SELECT * FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus   WHERE  idcompany=${valor.company}`;
    }
  }

  console.log(consulta);

  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.getData3d = (result) => {
  consulta1 = `SELECT  CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
    AND  mv_sesiones.type='3D WEB' 
    AND duration BETWEEN '00:00:01' AND '00:10:00'`;

  consulta2 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  (mv_sesiones.duration IS NOT NULl)
    AND  mv_sesiones.type='3D WEB' 
    AND duration BETWEEN '00:00:01' AND '00:10:00'
    GROUP BY mv_productos.id
    ORDER BY tiempoPromedio desc
    LIMIT 10`;

  consulta3 = `SELECT  count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='3D WEB' `;
  consulta4 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='3D WEB' 
        GROUP BY mv_productos.id
        ORDER BY sesiones desc
        LIMIT 10`;

  consulta5 = `SELECT  avg(mv_sesiones.clicks)  AS clicks 
FROM mv_sesiones 
WHERE (mv_sesiones.duration IS NOT NULl)
AND  mv_sesiones.type='3D WEB' 
AND clicks IS NOT NULL 
AND duration BETWEEN '00:00:01' AND '00:10:00'`;

  consulta6 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, ROUND( avg(mv_sesiones.clicks),2)  AS clicks 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  (mv_sesiones.duration IS NOT NULl)
        AND  mv_sesiones.type='3D WEB' 
        AND clicks IS NOT NULL 
        GROUP BY mv_productos.id
        ORDER BY clicks desc
        LIMIT 10`;

  consulta7 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='3D WEB' 
        GROUP BY DATE(mv_sesiones.created_at)`;

  sqlant.query(consulta1, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    sqlant.query(consulta2, (err, res1) => {
      if (err) {
        result(err, null);
        return;
      }
      sqlant.query(consulta3, (err, res2) => {
        if (err) {
          result(err, null);
          return;
        }
        sqlant.query(consulta4, (err, res3) => {
          if (err) {
            result(err, null);
            return;
          }

          sqlant.query(consulta5, (err, res4) => {
            if (err) {
              result(err, null);
              return;
            }

            sqlant.query(consulta6, (err, res5) => {
              console.log(res5);
              if (err) {
                result(err, null);
                return;
              }

              sqlant.query(consulta7, (err, res6) => {
                if (err) {
                  result(err, null);
                  return;
                }
                result(null, [res, res1, res2, res3, res4, res5, res6]);
              });
            });
          });
        });
      });
    });
  });
};

Product.getDataqrar = (result) => {
  consulta1 = `SELECT  CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
    AND  mv_sesiones.type='AR APP' 
    AND duration BETWEEN '00:00:01' AND '00:10:00'`;

  consulta2 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
FROM mv_sesiones, mv_productos 
WHERE mv_productos.id=mv_sesiones.mv_productos_id 
AND  (mv_sesiones.duration IS NOT NULl)
AND  mv_sesiones.type='AR APP' 
AND duration BETWEEN '00:00:01' AND '00:10:00'
GROUP BY mv_productos.id
ORDER BY tiempoPromedio desc
LIMIT 10`;

  consulta3 = `SELECT  count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='AR APP' `;

  consulta4 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, count(mv_sesiones.id)  AS sesiones 
FROM mv_sesiones, mv_productos 
WHERE mv_productos.id=mv_sesiones.mv_productos_id 
AND  mv_sesiones.type='AR APP' 
GROUP BY mv_productos.id
ORDER BY sesiones desc
LIMIT 10`;

  consulta5 = `SELECT  count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='QR AR APP'`;

  consulta6 = `SELECT  mv_productos.id, mv_productos.sku, mv_productos.nombre, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  mv_sesiones.type='QR AR APP' 
        GROUP BY mv_productos.id
        ORDER BY sesiones desc
        LIMIT 10`;

  consulta7 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  (mv_sesiones.type='AR APP' OR mv_sesiones.type='QR AR APP')
        GROUP BY DATE(mv_sesiones.created_at)`;

  consulta8 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  (mv_sesiones.type='AR APP')
        GROUP BY DATE(mv_sesiones.created_at)`;

  consulta9 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones 
        FROM mv_sesiones, mv_productos 
        WHERE mv_productos.id=mv_sesiones.mv_productos_id 
        AND  (mv_sesiones.type='QR AR APP')
        GROUP BY DATE(mv_sesiones.created_at)`;

  sqlant.query(consulta1, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    sqlant.query(consulta2, (err, res1) => {
      if (err) {
        result(err, null);
        return;
      }
      sqlant.query(consulta3, (err, res2) => {
        if (err) {
          result(err, null);
          return;
        }
        sqlant.query(consulta4, (err, res3) => {
          if (err) {
            result(err, null);
            return;
          }

          sqlant.query(consulta5, (err, res4) => {
            if (err) {
              result(err, null);
              return;
            }

            sqlant.query(consulta6, (err, res5) => {
              console.log(res5);
              if (err) {
                result(err, null);
                return;
              }

              sqlant.query(consulta7, (err, res6) => {
                if (err) {
                  result(err, null);
                  return;
                }
                sqlant.query(consulta8, (err, res7) => {
                  if (err) {
                    result(err, null);
                    return;
                  }
                  sqlant.query(consulta9, (err, res8) => {
                    if (err) {
                      result(err, null);
                      return;
                    }
                    console.log(res8, "8");
                    result(null, [
                      res,
                      res1,
                      res2,
                      res3,
                      res4,
                      res5,
                      res6,
                      res7,
                      res8,
                    ]);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

Product.getData = (result) => {
  consulta1 = `SELECT  count(mv_sesiones.id)  AS sesiones 
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  mv_sesiones.type='3D WEB'`;

  consulta2 = `SELECT  CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
    AND  mv_sesiones.type='3D WEB' 
    AND duration BETWEEN '00:00:01' AND '00:10:00'`;

  consulta3 = `SELECT  avg(mv_sesiones.clicks)  AS clicks 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
    AND  mv_sesiones.type='3D WEB' 
    AND clicks IS NOT NULL 
    AND duration BETWEEN '00:00:01' AND '00:10:00'`;
  consulta4 = `SELECT  CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
FROM mv_sesiones 
WHERE (mv_sesiones.duration IS NOT NULl)
AND  mv_sesiones.type='AR APP' 
AND duration BETWEEN '00:00:01' AND '00:10:00'`;

  consulta5 = `SELECT  count(mv_sesiones.id)  AS sesiones 
FROM mv_sesiones, mv_productos 
WHERE mv_productos.id=mv_sesiones.mv_productos_id 
AND  mv_sesiones.type='AR APP'`;

  consulta6 = `SELECT  count(mv_sesiones.id)  AS sesiones 
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  mv_sesiones.type='QR AR APP'`;
  consulta7 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones  
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  (mv_sesiones.type='QR AR APP' OR mv_sesiones.type='AR APP' OR mv_sesiones.type='3D WEB') 
    GROUP BY DATE(mv_sesiones.created_at)`;

  consulta8 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones  
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  mv_sesiones.type='3D WEB' 
    GROUP BY DATE(mv_sesiones.created_at);`;
  consulta9 = `SELECT  DATE(mv_sesiones.created_at) as fecha, count(mv_sesiones.id)  AS sesiones  
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    AND  (mv_sesiones.type='QR AR APP' OR mv_sesiones.type='AR APP')
    GROUP BY DATE(mv_sesiones.created_at);`;

  sqlant.query(consulta1, (err, res1) => {
    if (err) {
      result(err, null);
      return;
    }
    sqlant.query(consulta2, (err, res2) => {
      if (err) {
        result(err, null);
        return;
      }
      sqlant.query(consulta3, (err, res3) => {
        if (err) {
          result(err, null);
          return;
        }
        sqlant.query(consulta4, (err, res4) => {
          if (err) {
            result(err, null);
            return;
          }
          sqlant.query(consulta5, (err, res5) => {
            if (err) {
              result(err, null);
              return;
            }
            sqlant.query(consulta6, (err, res6) => {
              if (err) {
                result(err, null);
                return;
              }

              sqlant.query(consulta7, (err, res7) => {
                if (err) {
                  result(err, null);
                  return;
                }
                sqlant.query(consulta8, (err, res8) => {
                  if (err) {
                    result(err, null);
                    return;
                  }
                  sqlant.query(consulta9, (err, res9) => {
                    if (err) {
                      result(err, null);
                      return;
                    }
                    result(null, [
                      res1,
                      res2,
                      res3,
                      res4,
                      res5,
                      res6,
                      res7,
                      res8,
                      res9,
                    ]);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

Product.buildFiltros = (filtros, result) => {
  var conditions = "";
  for (var key1 in filtros) {
    if (key1 != "fechas") {
      conditions += `AND ${key1} in(`;
      filtros[key1].forEach((element) => {
        conditions += `'${element}',`;
      });
      conditions = conditions.substring(0, conditions.length - 1);
      conditions += ")";
    } else {
      if (!filtros[key1].fromDate == "") {
        conditions += `AND DATE(mv_sesiones.created_at) BETWEEN CAST('${filtros[key1].fromDate}' AS DATE) AND CAST('${filtros[key1].toDate}' AS DATE)`;
      }
    }
  }
  return null, conditions;
};

Product.getTotalVistas = ([filtros, fechas], result) => {
  var conditions = Product.buildFiltros(filtros);

  consulta = `SELECT  count(mv_sesiones.id)  AS sesiones 
    FROM mv_sesiones, mv_productos 
    WHERE mv_productos.id=mv_sesiones.mv_productos_id 
    ${conditions}`;

  sqlant.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.getAVGTime = ([filtros, fechas], result) => {
  var conditions = Product.buildFiltros(filtros);

  consulta = `SELECT  CAST( avg(mv_sesiones.duration) AS TIME) AS tiempoPromedio 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
    AND duration BETWEEN '00:00:01' AND '00:10:00'
    ${conditions}`;

  sqlant.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.getClicks = ([filtros, fechas], result) => {
  var conditions = Product.buildFiltros(filtros);

  consulta = `SELECT  avg(mv_sesiones.clicks)  AS clicks 
    FROM mv_sesiones 
    WHERE (mv_sesiones.duration IS NOT NULl)
       AND clicks IS NOT NULL 
    AND duration BETWEEN '00:00:01' AND '00:10:00'
     ${conditions}`;

  sqlant.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};
Product.filterProductsDashboard = (filtros, result) => {
  consulta = `SELECT * FROM product  INNER JOIN productOwner ON product.idproduct=productOwner.product_idproduct INNER JOIN project ON product.project_idproject = project.idproject WHERE productCategory_idproductCategory=${filtros.idcategory} AND productOwner.company_idcompany=${filtros.idbrand} AND project.company_idcompany=${filtros.idcompany}  `;

  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};

Product.productRequest = (data, result) => {
  sql.query("INSERT INTO productOrders SET ?", data, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    result(null, res);
  });
};

Product.filtersProductsId = (filtros, result) => {
  var catQuery = "";
  var brandQuery = "";
  var companyQuery = "";
  var productIdQuery = "";

  if (filtros.idcompany != "") {
    companyQuery = `and company.idcompany='${filtros.idcompany}' `;
  }

  console.log(filtros.idproduct, "cadada");
  if (filtros.idcategory != "") {
    catQuery = `and productCategory.idproductCategory='${filtros.idcategory}' `;
  }

  if (filtros.idbrand) {
    brandQuery = `and company.idcompany='${filtros.idbrand}' `;
  }

  if (filtros.idproduct) {
    productIdQuery = `and productOwner.product_idproduct='${filtros.idproduct}' `;
  }

  consulta = `SELECT distinct idproduct FROM
    ( SELECT company.*, product.* , productCategory.*,productStatus.* FROM  product INNER JOIN project ON product.project_idproject=project.idproject INNER JOIN company ON project.company_idcompany=company.idcompany   INNER JOIN productCategory ON product.productCategory_idproductCategory=productCategory.idproductCategory  INNER JOIN productStatus ON product.productStatus_idproductStatus =productStatus.idproductStatus where 1 ${catQuery} ${companyQuery}) 
     t,company,productOwner WHERE company.idcompany=productOwner.company_idcompany and productOwner.product_idproduct=t.idproduct ${brandQuery}  ${productIdQuery} `;

  console.log(consulta);
  sql.query(consulta, (err, res) => {
    if (err) {
      result(err, null);
      return;
    }

    result(null, res);
  });
};
module.exports = Product;
