const sql = require("./db.js");

// constructor
const Revision = function(revision) {
    this.idrevision = revision.idrevision;
    this.description = revision.description;
    this.imageUrl = revision.imageUrl;
    this.user_iduser = revision.user_iduser;
    this.productStatus_idproductStatus = revision.productStatus_idproductStatus;
    this.product_idproduct = revision.product_idproduct;
    this.creationDate = revision.creationDate;

};


Revision.createRevisionByidProduct = (revision, result) => {
    //console.log(revision);
    sql.query("INSERT INTO revision SET ?", revision, (err, res) => {
        if (err) {
            //console.log("error: ", err);
            result(err, null);
            return;
        }

        result(null, { revision });
    });
};


Revision.getAllRevisionByidProduct = ([revision,idcompany], result) => {

    if (idcompany== 11) {
        consulta = `SELECT revision.description, revision.creationDate, revision.imageUrl, user.name,user.lastName,user.iduser FROM revision  inner join user on revision.user_iduser =user.iduser     WHERE product_idproduct=${revision.product_idproduct} ORDER BY revision.creationDate asc`
    } else {
        consulta = `SELECT revision.description, revision.creationDate, revision.imageUrl, user.name,user.lastName,user.iduser FROM revision  inner join user on revision.user_iduser =user.iduser  inner join product on revision.product_idproduct =product.idproduct    inner join project on product.project_idproject =project.idproject    WHERE product_idproduct=${revision.product_idproduct} AND  project.company_idcompany=${idcompany} ORDER BY revision.creationDate asc `   
       }


    sql.query(consulta, revision.product_idproduct, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, res);
    });
};



Revision.getAllRoles = (result) => {

    sql.query("SELECT * FROM rol", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });

};


Revision.getNotifications = (iduser, result) => {

        consulta = `CALL GetNotifications(${iduser})`
   
       


    sql.query(consulta, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        console.log(res);

        result(null, res[0]);
    });
};

Revision.UpdateNotifications = ([iduser,productId], result) => {
console.log(iduser,productId,"en model");

        consulta = `CALL UpdateNotifications(${iduser},${productId}) `   
    


    sql.query(consulta, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, res);
    });
};


module.exports = Revision;