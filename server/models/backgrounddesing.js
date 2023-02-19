
const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const BackgroundDesing = function(backgrounddesing) {
    this.idBackground = backgrounddesing.idBackground;
    this.BackgroundName = backgrounddesing.BackgroundName;
};

BackgroundDesing.createBackgroundDesing = (newBackgroundDesing, result) => {
    sql.query("INSERT INTO backgroundDesign SET ?", newBackgroundDesing, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { newBackgroundDesing });
    });
};




BackgroundDesing.getAllBackgroundDesingByIdBackground = (background, result) => {

  console.log(background);
    sql.query(
      "SELECT * FROM backgroundDesign WHERE Background_idBackground=? ",
      [background.idBackground],
      (err, res) => {
        if (err) {
          result(err, null);
          return;
        }
      console.log(res);
  
        if (res) {
          
        result(null, res);
        }
  return; 
      }
    );
  };
module.exports = BackgroundDesing;
