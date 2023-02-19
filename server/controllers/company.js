const Company = require("../models/company");
const randompassword = require('secure-random-password');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const date = require('date-and-time');
var fs = require('fs');

exports.getAllCompany = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    Company.getAllCompany((err, data) => {


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


exports.getAllCompanybyBrands = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    Company.getAllCompanybyBrands((err, data) => {


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


exports.createCompany = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'tbl_user_type_description Content can not be empty!',
        });
        return;

    }
    let valorRandom = randompassword.randomPassword({ length: 20, characters: [randompassword.lower,randompassword.upper, randompassword.digits] });


    // Create a Customer
    const company = new Company({
        
        nameCompany: req.body.nameCompany,
        nit:req.body.nit,
        createdDate:new Date(),
        companyType_idcompanyType: req.body.companyType_idcompanyType,
        companyStatus_idcompanyStatus:1,
        TokenAPI:valorRandom

    });

    Company.createCompany(company, (err, data) => {


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

exports.getCompanyById = (req, res) => {
    // Validate request

    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'tbl_user_type_description Content can not be empty!',
        });
        return;

    }


    // Create a Customer
    const company = new Company({
        idcompany: req.body.idcompany,

    });

    Company.getCompanyById(company, (err, data) => {


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


exports.updateInfoCompanyById = (req, res, next) => {
    const company = new Company({
        idcompany: req.body.idcompany,
        nameCompany: req.body.nameCompany,
        nit:req.body.nit,
        createdDate:new Date(),
        companyType_idcompanyType: req.body.companyType_idcompanyType
    });

    Company.updateInfoCompanyById(company, (err, data) => {



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

exports.activeCompanyById = (req, res, next) => {
 
    Company.activeCompanyById(req.body, (err, data) => {



        res.json({
            status: true,
            user: data,
            

        });



    });


};

exports.inactiveCompanyById = (req, res, next) => {
    Company.inactiveCompanyById(req.body, (err, data) => {



        res.json({
            status: true,
            user: data,
            

        });



    });
};
exports.filterCompanies = (req, res, next) => {
    const filtros = ({
        companyType_idcompanyType: req.body.companyType_idcompanyType,
        idstatus:req.body.idstatus
      
    });

    Company.filterCompanies(filtros, (err, data) => {


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





exports.getBrandsByCompany = (req, res, next) => {

    Company.getBrandsByCompany(req.body.idcompany, (err, data) => {


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


