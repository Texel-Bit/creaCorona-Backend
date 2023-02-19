const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const Category = function (category) {
    this.idproductCategory = productcategory.idproductCategory;
    this.nameProductCategory = productcategory.nameProductCategory;
};

Category.updateCategoryImageURL = (updateCategory, result) => {
console.log(updateCategory);
    sql.query(
      "update  category SET categoryImageURL=? where idcategory=?",
      [
        updateCategory.categoryImageURL,
   
        updateCategory.idcategory,
      ],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
        if (res == "") {
          result(null, 'ok');
          return;
        }
  
        console.log(res);
        result(null, res);
      }
    );
  };

Category.updateAllCategoryByVTEX =async (categories, result) => {
    await categories.forEach(function  (data, index) {
        sql.query("SELECT * FROM category WHERE idcategory =?",data.Id, (err, res) => {

                if (err) {
                    console.log("error 1");
                    result(err, null);
                    return;
                }

                if (res.length  == 0 ) {

                    sql.query("INSERT INTO  category SET idcategory= ? ,categoryName =?,categoryParentID=?", [data.Id, data.Name, data.FatherCategoryId], (err, resp) => {


                        if (err) {
                            //console.log("error: ", err);
                            console.log("error 2");

                            result(err, null);
                            return;
                        }

                    });

                } else {

                    sql.query("UPDATE category SET categoryName =?,categoryParentID=? where idcategory=? ", [data.Name, data.FatherCategoryId, data.Id], (err, resp) => {

                        if (err) {
                            //console.log("error: ", err);
                            console.log("error 3");

                            result(err, null);
                            return;
                        }

                    });
                }

              
            }
            
            
            );




    });

    result(null);

};

Category.getCategoryByIdCategory = (data, result) => {
    sql.query(
      "SELECT * FROM category WHERE idcategory=?",
      [data.idcategory],
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
Category.getAllCategory = (result) => {

    sql.query("select * FROM category WHERE categoryParentID  IS NULL;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};
Category.getAllSubCategory = (result) => {

    sql.query("select * FROM category WHERE categoryParentID  IS NOT NULL;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

Category.getAllSubCategoryByIdProduct = (data,result) => {
    sql.query(`SELECT * FROM product_has_category
    INNER JOIN category
    ON product_has_category.category_idcategory = category.idcategory WHERE product_has_category.product_idproduct=${data} AND category.categoryParentID IS not null`, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {
if (res==null) {
    result(null, null);
    
}


            result(null, res);
        }

    });


};

// Productcategory.updateProductCategoryById = (productcategory, result) => {
//     sql.query("update  productCategory SET nameProductCategory=? where idproductCategory =?", [productcategory.nameProductCategory, productcategory.idproductCategory], (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         if (res == "") {
//             result(null, res[0]);
//             return;
//         }

//         result(null, res[0]);
//     });
// };


// Productcategory.getProductsCategoriesByCompany = (idcompany, result) => {
//     console.log(idcompany);


//     consulta = `CALL GetProductsCategoriesByCompany(${idcompany})`




//     sql.query(consulta, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         console.log(res);

//         result(null, res[0]);
//     });
// };
module.exports = Category;