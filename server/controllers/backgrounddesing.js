const BackgroundDesing = require("../models/backgrounddesing");

const jwt = require('jsonwebtoken');
const { subirArchivoImagen } = require("../helpers/subirarchivos");

exports.createBackgroundDesing =async (req, res) => {
    if (!req.body) {
        res.status(400).json({
            status: 'error',
            error: 'error en body!',
        });
        return;

    }

    try {
        var pacthcompleto = await subirArchivoImagen(
            req.files, ["jpg", "png", "jpeg"],
            "uploads/backgrounddesing"
        );
    } catch (msg) {
        res.status(400).json({ msg });
    }
    const backgroundDesing = ({
        
        backgroundDesignName: req.body.backgroundDesignName,
        backgroundDesignImageURL: pacthcompleto,
        backgroundDesignCreatedAt:new Date,
        Background_idBackground:req.body.Background_idBackground

    
    });


    BackgroundDesing.createBackgroundDesing (backgroundDesing,  (err, data) => {
    

        if (err)
            res.status(500).send({
                message: err.message 
            });
        else {


           if (data.message) {
            res.json({
                status: false,
                message:data
                
            });           } else {
                res.json({
                    status: true,
                    
                });
            
           }
         

          
        }

    });


};


