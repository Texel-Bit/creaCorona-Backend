const sql = require("./db.js");
const sqlant = require("./dbant.js");

const bcrypt = require('bcrypt');

// constructor
const Company = function (company) {
    this.idcompany = company.idcompany;
    this.nameCompany = company.nameCompany;
    this.createdDate = company.createdDate;
    this.companyType_idcompanyType = company.companyType_idcompanyType;
    this.nit = company.nit;
    this.prefixPath = company.prefixPath;
    this.companyStatus_idcompanyStatus = company.companyStatus_idcompanyStatus;
    this.TokenAPI=company.TokenAPI
};


Company.createCompany = (newCompany, result) => {
    sql.query("INSERT INTO company SET ?", newCompany, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        var prefix = newCompany.nameCompany
        prefix = prefix.toLowerCase()
        prefix = prefix.replace(/ /g, '_')


        sql.query("update  company SET prefixPath= ? where idcompany =?", [prefix, res.insertId], (err, resupd) => {
            if (err) {
                result(err, null);
                return;
            }
            var consulta = `INSERT INTO mv_clientes (id,nombre, production_url, sandbox_url) VALUES ('${res.insertId}','${newCompany.nameCompany}', 'https://clientes.mudi.com.co/${prefix}/public_html', 'https://clientes.mudi.com.co/${prefix}/public_html');`
            sqlant.query(consulta, (err, res) => {
                if (err) {
                    result(err, null);
                    return;
                }




            });


        });
        result(null, { newCompany });
    });
};



Company.getAllCompany = (result) => {

    sql.query("SELECT * FROM company  INNER JOIN companyType ON company.companyType_idcompanyType=companyType.idcompanyType;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

Company.getAllCompanybyBrands = (result) => {

    sql.query("SELECT * FROM company where companyType_idcompanyType=2", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};


Company.getCompanyById = (company, result) => {
    sql.query("SELECT * FROM company WHERE idcompany =?",
        company.idcompany, (err, res) => {
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

Company.updateInfoCompanyById = (company, result) => {
    sql.query("update  company SET nit= ?,companyType_idcompanyType=?,nameCompany=? where idcompany =?", [company.nit, company.companyType_idcompanyType, company.nameCompany, company.idcompany], (err, res) => {
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



Company.inactiveCompanyById = (company, result) => {
    sql.query("update company set companyStatus_idcompanyStatus=2  where idcompany =?", [company.idcompany], (err, res) => {
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

Company.activeCompanyById = (company, result) => {
    sql.query("update company set companyStatus_idcompanyStatus=1  where idcompany =?", [company.idcompany], (err, res) => {
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
Company.filterCompanies = (filtros, result) => {

    consulta = "SELECT * FROM company  INNER JOIN companyType ON company.companyType_idcompanyType=companyType.idcompanyType  "

    if (filtros.companyType_idcompanyType != "" || filtros.idstatus != "") {
        consulta=   consulta + "where ";
        if (filtros.companyType_idcompanyType) {


            consulta = `${consulta}  company.companyType_idcompanyType=${filtros.companyType_idcompanyType} `


        }

        if (filtros.idstatus != "") {
            if (filtros.companyType_idcompanyType != "") {
                consulta = ` ${consulta} and  companyStatus_idcompanyStatus=${filtros.idstatus} `

            } else {
                consulta = ` ${consulta}   companyStatus_idcompanyStatus=${filtros.idstatus} `

            }

        }
    }
    sql.query(consulta, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }


        result(null, res);
    });
};


Company.getBrandsByCompany = (idcompany, result) => {
    console.log(idcompany);
    if (idcompany) {
        consulta = `CALL GetBrandsByCompany(${idcompany})`

    }else{
        consulta = `CALL GetBrandsByCompany(0)`

    }
    
       
    
    
    sql.query(consulta, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }
        console.log(res);
    
        result(null, res[0]);
    });
    };
module.exports = Company;