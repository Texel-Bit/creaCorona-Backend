
const sql = require("./db.js");
const bcrypt = require('bcrypt');

// constructor
const Backgroundsocket = function(backgroundsocket) {
    this.idBackgroundSocket = backgroundsocket.idBackgroundSocket;
    this.top = backgroundsocket.top;
    this.bottom = backgroundsocket.bottom;

    this.width = backgroundsocket.width;
    this.height=backgroundsocket.height;
this.left=backgroundsocket.left;
this.resolution=backgroundsocket.resolution;
    this.Background_idBackground = backgroundsocket.Background_idBackground;

}; 

Backgroundsocket.createBackgroundSocketForCategory = (newBackground, result) => {

    sql.query("select * from BackgroundSocket_has_category where BackgroundSocket_idBackgroundSocket=? and category_idcategory=?", [newBackground.BackgroundSocket_idBackgroundSocket,newBackground.category_idcategory], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        else{
            if (!res[0]) {
                sql.query("INSERT INTO BackgroundSocket_has_category SET ?", [newBackground], (err, res) => {
                    if (err) {
                        result(err, null);
                        return;
                    }
            
                    result(null, res.insertId);
                });   
            
            } else {
                result(null, {message:'ya existe'});

            }

        
        
        
    }
});

};
Backgroundsocket.createBackgroundSocket = (newBackground, result) => {
    sql.query("INSERT INTO BackgroundSocket SET ?", newBackground, (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, res.insertId);
    });
};




Backgroundsocket.deleteBackgroundSocket = (Background, result) => {
    sql.query("delete from BackgroundSocket  where idBackgroundSocket=?", [Background.idBackgroundSocket], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        result(null, { result });
    });
};

Backgroundsocket.updateBackgroundSocket = (newBackground, result) => {

    console.log(newBackground);
    sql.query("UPDATE BackgroundSocket SET top=?,bottom=?,width=?,height=?,`left`=?,resolution=? where idBackgroundSocket=?", [newBackground.top,newBackground.bottom,newBackground.width,newBackground.height,newBackground.left,newBackground.resolution, newBackground.idBackgroundSocket], (err, res) => {
        console.log(err);

        if (err) {
            result(err, null);
            return;
        }
        result(null, { newBackground });
    });
};

Backgroundsocket.getAllBackgroundSocket = (background,result) => {

    console.log(background);
    if (background.idBackground) {
        var consulta = `select * FROM BackgroundSocket where Background_idBackground=${background.idBackground};`

    } else {
        var consulta = `select * FROM BackgroundSocket;`

    }
    sql.query(consulta, (err, res) => {
        if (err) {
            result(err, null);
            return;
        } else {

            result(null, res);
        }
    });
};


Backgroundsocket.getAllBackgroundSocketByBackground = (backgroundSocket, result) => {
    sql.query(
      "select * from BackgroundSocket where Background_idBackground=?",
      [backgroundSocket.idBackground],
      (err, res) => {
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
  
        result(null, res);
      }
    );
  };


  Backgroundsocket.getCategoriesByidBackgroundSocket = (Background, result) => {

    sql.query("select category_idcategory from BackgroundSocket_has_category where BackgroundSocket_idBackgroundSocket=? ", [Background.idBackgroundSocket], (err, res) => {
        if (err) {
            result(err, null);
            return;
        }

        else{
   
            result(null, res);

        
        
        
    }
});

};
module.exports = Backgroundsocket;