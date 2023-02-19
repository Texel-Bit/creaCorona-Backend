const Project = require("../models/project");

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


exports.getAllProject = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro consultar',
        });
        return;

    }

    Project.getAllProject((err, data) => {


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

exports.createProject = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'tbl_user_type_description Content can not be empty!',
        });
        return;

    }


    // Create a Customer
    const project = new Project({

        name: req.body.name,
        is_ar_btn: req.body.is_ar_btn,
        is_webxr: req.body.is_webxr,
        is_auto_rotate: req.body.is_auto_rotate,
        is_production: req.body.is_production,
        created_at: new Date(),
        company_idcompany: req.body.company_idcompany,
        projectStatus_idprojectStatus:1
    });

    Project.createProject(project, (err, data) => {


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



exports.getProjectById = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }
    //console.log(req.body);
    const projectById = new Project({
        idproject: req.body.idproject,

    });

    Project.getProjectById(projectById, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
      
            res.json({
                status: true,
                data
            });
        }

    });


};

exports.updateProjectById = (req, res, next) => {
    const project = new Project({
        idproject: req.body.idproject,
        name: req.body.name,
        is_ar_btn: req.body.is_ar_btn,
        is_webxr: req.body.is_webxr,
        is_auto_rotate: req.body.is_auto_rotate,
        is_production: req.body.is_production,
        created_at: new Date(),
        company_idcompany: req.body.company_idcompany
    });
    Project.updateProductCategoryById(project, (err, data) => {


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
exports.getAllProjectByCompanyId = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }
    const company =({
        idcompany: req.body.company_idcompany,

    });

    Project.getAllProjectByCompanyId(company, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
      
            res.json({
                status: true,
                data
            });
        }

    });


};

exports.activeProjectById = (req, res, next) => {
 
    Project.activeProjectById(req.body, (err, data) => {



        res.json({
            status: true,
            user: data,
            

        });



    });


};

exports.inactiveProjectById = (req, res, next) => {
    Project.inactiveProjectById(req.body, (err, data) => {



        res.json({
            status: true,
            user: data,
            

        });



    });
};

exports.getProjectUserById = (req, res, next) => {
    Project.getProjectUserById(req.body, (err, data) => {



        res.json({
            status: true,
            data    
            

        });



    });
};


exports.deleteProjectUserByIdProjectId = (req, res, next) => {
    Project.deleteProjectUserByIdProjectId(req.body, (err, data) => {



        res.json({
            status: true,
            data    
            

        });



    });
};

exports.createProjectUserByIdProjectId = (req, res, next) => {
    Project.createProjectUserByIdProjectId(req.body, (err, data) => {



        res.json({
            status: true,
            data    
            

        });



    });
};

exports.filterProjects = (req, res, next) => {
    const filtros = ({
        idcompany: req.body.idcompany,
     
        idstatus: req.body.idstatus,
      
    });

    Project.filterProjects(filtros, (err, data) => {


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




