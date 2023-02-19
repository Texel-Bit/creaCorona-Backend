const Productsubcategory = require("../models/productsubcategory");

const jwt = require('jsonwebtoken');
const date = require('date-and-time');

exports.getAllProductSubCategory = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    Productsubcategory.getAllProductSubCategory((err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
            // let token = jwt.sign({
            //     user: user,
            // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            // res.setHeader('token', token);
            res.json({
                status: true,
                data
            });
        }

    });


};




exports.createProductSubCategory = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'tbl_user_type_description Content can not be empty!',
        });
        return;

    }


    // Create a Customer
    const productsubcategory = new Productsubcategory({
        nameProductSubCategory: req.body.nameProductSubCategory,
        productCategory_idproductCategory:req.body.productCategory_idproductCategory
    });

    Productsubcategory.createProductSubCategory(productsubcategory, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "Some error occurred while creating the userTypeCompanyUser."
            });
        else {
            // let token = jwt.sign({
            //     user: user,
            // }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            // res.setHeader('token', token);

            res.json({
                status: true,
                data
            });
        }

    });


};