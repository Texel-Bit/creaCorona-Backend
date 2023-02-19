const CompanyType = require("../models/companyType");
const randompassword = require('secure-random-password');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const date = require('date-and-time');

exports.getAllCompanyType = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    CompanyType.getAllCompanyType((err, data) => {


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

