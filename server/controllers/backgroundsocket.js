const Backgroundsocket = require("../models/backgroundsocket");

const jwt = require('jsonwebtoken');
const Background = require("../models/background");

exports.createBackgroundSocketForCategory = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }


    req.body.idcategories.forEach(socket => {
        const backgroundSocket = ({
        
            BackgroundSocket_idBackgroundSocket: req.body.idBackgroundSocket,
            category_idcategory: socket,
        
        });
        Backgroundsocket.createBackgroundSocketForCategory(backgroundSocket, (err, data) => {


            if (err)
                res.status(500).send({
                    status: false,
                    message: err 
                });
            else {
    
    
               if (data.message) {
                // res.json({
                //     status: false,
                //     message:data.message
                    
                // });     
                  } else {
                    res.json({
                        status: true,
                        
                    });
                
               }
             
    
              
            }
    
        });
});
   


};
exports.createBackgroundSocket = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: false,
            error: 'error en body!',
        }); 
        return;

    }

    const backgroundSocket = new Backgroundsocket({
        
        top: req.body.top,
        bottom: req.body.bottom,
        width: req.body.width,
        left:req.body.left,
        height:req.body.height,
        resolution:req.body.resolution,
        Background_idBackground: req.body.Background_idBackground,
    });


    Backgroundsocket.createBackgroundSocket(backgroundSocket, (err, data) => {


        if (err)
            res.status(500).send({
                status: false,

                message: err.message 
            });
        else {

         

            res.json({
                status: true,
                idBackgroundSocket:data
            });
        }

    });


};

exports.updateBackgroundSocket = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }
    const backgroundSocket = new Backgroundsocket({
        idBackgroundSocket: req.body.idBackgroundSocket,
        top: req.body.top,
        bottom: req.body.bottom,
        height:req.body.height,
        left:req.body.left,
        width: req.body.width,
        resolution:req.body.resolution,
        Background_idBackground: req.body.Background_idBackground,
    });
    Backgroundsocket.updateBackgroundSocket(backgroundSocket, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message
            });
        else {

         

            res.json({
                status: true,
                data
            });
        }

    });


};


exports.deleteBackgroundSocket = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }
    const backgroundSocket =({
        idBackgroundSocket: req.body.idBackgroundSocket,
  
    });
    Backgroundsocket.deleteBackgroundSocket(backgroundSocket, (err, data) => {


        if (err)
            res.status(500).send({
                status:false,
                message: err.message
            });
        else {

         

            res.json({
                status: true,
                
            });
        }

    });


};


exports.getAllBackgroundSocket = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    const backgroundSocket =({
   
        idBackground: req.body.idBackground,
    });

    Backgroundsocket.getAllBackgroundSocket(backgroundSocket,(err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {

if (data.length==0) {
    res.json({
        status: true,
        data
      });    
}
            data.forEach((element, index) => {
                Backgroundsocket.getCategoriesByidBackgroundSocket(element, (err, resultCategories) => {
                  if (err)
                    res.status(500).send({
                      message: err.message || "no se pudo consultar",
                    });
                  else {
                    console.log("hola");
                    if (resultCategories) {
                        categories=[]
                        resultCategories.forEach(element => {

                            console.log(element);
                            categories.push(element.category_idcategory)
});

                       
                      data[index].idcategories=categories;
                    }else{
                        data[index].idcategories=[]
                    }
        
                    if (index == data.length - 1) {
                      res.json({
                        status: true,
                        data
                      });
                    }
                  }
                });
              });
         
        }

    });


};


exports.getAllBackgroundSocketByBackground = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }
    const backgroundSocket =({
   
        idBackground: req.body.idBackground,
    });
    Backgroundsocket.getAllBackgroundSocketByBackground(backgroundSocket, (err, data) => {


        if (err)
            res.status(500).send({
                message: err.message
            });
        else {

         

            res.json({
                status: true,
                data
            });
        }

    });


};
