
const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const Background = function(background) {
    this.idBackground = background.idBackground;
    this.BackgroundName = background.BackgroundName;
};

Background.createBackground = (newBackground, result) => {
    sql.query("INSERT INTO Background SET ?", newBackground, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null,res.insertId);
    });
};


Background.updateBackground = (newBackground, result) => {
    sql.query("UPDATE Background SET BackgroundName=? where idBackground=?", [newBackground.BackgroundName,newBackground.idBackground], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { newBackground });
    });
};


Background.deleteBackground = (background, result) => {
    sql.query("delete from  Background  where idBackground=?", [background.idBackground], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { result });
    });
};
Background.getAllBackground = (result) => {

    sql.query("select * FROM Background;", (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }

    });


};
module.exports = Background;