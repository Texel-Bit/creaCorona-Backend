const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const Companytype = function(companytype) {
    this.idcompany = companytype.idcompany;
    this.nit=companytype.nit;
    this.nameCompany = companytype.nameCompany;
   this.createdDate=companytype.createdDate;
   this.companyType_idcompanyType=companytype.companyType_idcompanyType;
};



Companytype.getAllCompanyType = (result) => {

    sql.query("SELECT * FROM companyType  ;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

module.exports = Companytype;