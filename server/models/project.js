const sql = require("./db.js");
const bcrypt = require('bcrypt');
const sqlant = require("./dbant.js");

// constructor
const Project = function (project) {
    this.idproject = project.idproject;
    this.name = project.name;
    this.is_ar_btn = project.is_ar_btn;
    this.is_webxr = project.is_webxr;
    this.is_auto_rotate = project.is_auto_rotate;
    this.is_production = project.is_production;
    this.created_at = project.created_at
    this.company_idcompany = project.company_idcompany;
    this.projectStatus_idprojectStatus = project.projectStatus_idprojectStatus;

};

Project.getAllProject = (result) => {

    sql.query("SELECT * FROM project inner join company on project.company_idcompany=company.idcompany ;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

Project.createProject = (newProject, result) => {
    sql.query("INSERT INTO project SET ?", newProject, (err, res) => {
        if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
        }

        var consulta = `INSERT INTO mv_proyectos  (id, mv_clientes_id, nombre,is_ar_btn,is_webxr,is_auto_rotate,is_production)  VALUES ('${res.insertId}','${newProject.company_idcompany}','${newProject.name}',1,0,1,0);`
        sqlant.query(consulta, (err, res) => {
            if (err) {
                //console.log("error: ", err);
                result(err, null);
                return;
            }




        });

        result(null, { newProject });
    });
};




Project.getProjectById = (project, result) => {
    sql.query("SELECT * FROM project WHERE idproject =?",
        project.idproject, (err, res) => {
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

            //console.log(res);


            result(null, res[0]);
        });
};

Project.getAllProjectByCompanyId = (company, result) => {
    sql.query("SELECT * FROM project WHERE company_idcompany =?",
        company.idcompany, (err, res) => {
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

            //console.log(res);


            result(null, res);
        });
};

Project.updateProductCategoryById = (product, result) => {
    sql.query("update  project SET name=?,is_ar_btn=?,is_webxr=?, is_auto_rotate=?,is_production=?,company_idcompany=? where idproject =?", [product.name, product.is_ar_btn, product.is_webxr, product.is_auto_rotate, product.is_production, product.company_idcompany, product.idproject], (err, res) => {
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
    });
};



Project.inactiveProjectById = (project, result) => {
    sql.query("update project set projectStatus_idprojectStatus=2  where idproject =?", [project.idproject], (err, res) => {
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
    });
};

Project.activeProjectById = (project, result) => {
    sql.query("update project set projectStatus_idprojectStatus=1  where idproject =?", [project.idproject], (err, res) => {
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
    });
};

Project.getProjectUserById = (project, result) => {

    sql.query("SELECT * FROM UserProject INNER JOIN  project ON UserProject.idProject=project.idproject where idUser=?", project.iduser, (err, res) => {
        console.log(res);
        if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res == "") {
            result(null, res[0]);
            return;
        }

        result(null, res);
    });
};


Project.deleteProjectUserByIdProjectId = (project, result) => {
    console.log(project);
    sql.query("delete from UserProject  where idProject=? and  idUser=?", [project.idproject, project.iduser], (err, res) => {
        if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res == "") {
            result(null, res[0]);
            return;
        }

        result(null, res);
    });
};

Project.createProjectUserByIdProjectId = (project, result) => {

    console.log(project);
    sql.query("insert into UserProject   values(?,?)", [project.idProject, project.idUser], (err, res) => {
        if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res == "") {
            result(null, res[0]);
            return;
        }

        result(null, res);
    });
};

Project.filterProjects = (filtros, result) => {

    consulta = "SELECT * FROM project inner join company on project.company_idcompany=company.idcompany   "

    if (filtros.idcompany != "" || filtros.idstatus != "") {
        consulta = consulta + "where ";
        if (filtros.idcompany != "") {

            consulta = `${consulta}   company.idcompany=${filtros.idcompany} `

        }


        if (filtros.idstatus != "") {
            if (!filtros.idcompany != "") {
                consulta = ` ${consulta}  projectStatus_idprojectStatus=${filtros.idstatus} `

            } else {
                consulta = ` ${consulta} and projectStatus_idprojectStatus=${filtros.idstatus} `

            }

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


module.exports = Project;