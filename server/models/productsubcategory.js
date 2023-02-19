const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const Productsubcategory = function(productsubcategory) {
    this.idproductSubCategory = productsubcategory.idproductSubCategory;
    this.nameProductSubCategory = productsubcategory.nameProductSubCategory;
    this.productCategory_idproductCategory=productsubcategory.productCategory_idproductCategory
};


Productsubcategory.createProductSubCategory = (newproductsubcategory, result) => {
    sql.query("INSERT INTO productSubCategory SET ?", newproductsubcategory, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { newproductsubcategory });
    });
};



Productsubcategory.getAllProductSubCategory = (result) => {

    sql.query("SELECT * FROM productSubCategory INNER JOIN productCategory ON productSubCategory.productCategory_idproductCategory =productCategory.idproductCategory;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

module.exports = Productsubcategory;