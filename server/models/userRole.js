const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const UserRole = function(userRole) {
    this.iduserRole = userRole.iduserRole;
    this.roleDescription = userRole.roleDescription;
   
};






UserRole.getAllUserRole = (result) => {

    sql.query("SELECT * FROM userRole", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};

module.exports = UserRole;