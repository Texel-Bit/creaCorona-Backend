const Background = require("../models/background");

const jwt = require('jsonwebtoken');
const BackgroundDesing = require("../models/backgrounddesing");
const Backgroundsocket = require("../models/backgroundsocket");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
var fs = require("fs");


exports.createBackground = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: false,
            error: 'error en body!',
        });
        return;

    }

    const background =({
        
        BackgroundName: req.body.BackgroundName,
  

    });


    Background.createBackground(background,async (err, data) => {


        if (err)
            res.status(500).send({
                status: false,

                message: err.message || "Some error occurred while creating the userTypeCompanyUser."
            });
        else {
            
                try {
                    var pacthcompleto = await subirArchivoImagen(
                        req.files, ["jpg", "png", "jpeg"],
                        "uploads/backgrounddesing"
                    );
                } catch (msg) {
                    res.status(400).json({ 
                        status: false,

                        msg });
                }
                const backgroundDesing = ({
                    
                    backgroundDesignName: req.body.backgroundDesignName,
                    backgroundDesignImageURL: pacthcompleto,
                    backgroundDesignCreatedAt:new Date,
                    Background_idBackground:data
            
                
                });
            
            

                BackgroundDesing.createBackgroundDesing (backgroundDesing,  (err, dataDesing) => {
                
            
                    if (err)
                        res.status(500).send({
                            status: false,

                            message: err.message 
                        });
                    else {
            
            
                       if (dataDesing.message) {
                        res.json({
                            status: false,
                            message:dataDesing
                            
                        });           } else {
                            const backgroundSocket = ({
        
                                top: req.body.top,
                                bottom: req.body.bottom,
                                width: req.body.width,
                                height:req.body.height,
                                left:req.body.height,
                                Background_idBackground: backgroundDesing.Background_idBackground,
                            });
                        
                        
                            Backgroundsocket.createBackgroundSocket(backgroundSocket, (err, dataSocket) => {
                        
                        
                                if (err)
                                    res.status(500).send({

                                        status: false,

                                        message: err.message 
                                    });
                                else {
                        
                                 
                        
                                    const backgroundSocketCategory = ({
        
                                        BackgroundSocket_idBackgroundSocket: dataSocket,
                                        category_idcategory: req.body.idcategory,
                                    
                                    });
                                
                                
                                    Backgroundsocket.createBackgroundSocketForCategory(backgroundSocketCategory, (err, dataCategory) => {
                                
                                
                                        if (err)
                                            res.status(500).send({
                                                status: false,

                                                message: err.message 
                                            });
                                        else {
                                
                                
                                           if (dataCategory.message) {
                                            res.json({
                                                status: false,
                                                message:dataCategory.message
                                                
                                            });           } else {
                                                res.json({
                                                    status: true,
                                                   idBackground:backgroundDesing.Background_idBackground
                                                    
                                                });
                                            
                                           }
                                         
                                
                                          
                                        }
                                
                                    });
                                }
                        
                            });
                        
                       }
                     
            
                      
                    }
            
                });
            
          
        }

    });


};

exports.updateBackground = (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }
    const background = new Background({
        idBackground:req.body.idBackground,
        BackgroundName: req.body.BackgroundName,
  

    });
    Background.updateBackground(background, (err, data) => {


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

exports.getAllBackground = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'no se logro crear',
        });
        return;

    }

    Background.getAllBackground((err, data) => {


        if (err)
            res.status(500).send({
                message: err.message || "no se pudo consultar"
            });
        else {
            data.forEach((element, index) => {
                BackgroundDesing.getAllBackgroundDesingByIdBackground(element, (err, backgroundDesing) => {
                  if (err)
                    res.status(500).send({
                      message: err.message || "no se pudo consultar",
                    });
                  else {
                    if (backgroundDesing) {
                      data[index].backgroundDesing = backgroundDesing;
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



exports.deleteBackground = async (req, res) => {
    if (!req.body) {
      res.status(400).json({
        status: "error",
        error: "error en body!",
      });
      return;
    }
  
 
  
    const background = {
        idBackground: req.body.idBackground,
    };



    BackgroundDesing.getAllBackgroundDesingByIdBackground(background, (err, data) => {
      if (err) {
        res.status(500).send({
            status:false,   
          message: err.message,
        });
      } else {
        

if (data.length>0) {
  
       if (

            fs.existsSync(process.cwd() + "\\" + data[0].backgroundDesignImageURL)
          ) {
            fs.unlinkSync(process.cwd() + "\\" + data[0].backgroundDesignImageURL);
            deleteBackground();
          } else {
            deleteBackground();
          }
     

      }   else{
        deleteBackground();

      }
  
        function deleteBackground() {
          Background.deleteBackground(background, (err, data) => {
            if (err)
              res.status(500).send({
                message: err.message,
              });
            else {
              res.json({
                status: true,
              });
            }
          });
        }
      }
    });
  };