const {
    createDesignColors,updateDesignColors
  
  } = require("../models/designColors");
  





exports.createDesignColors = async(req, res) => {

    try {
    const { DesignColorName, DesignColorPath, idDesignType  } = req.body
  const  data= {
    DesignColorName,
    DesignColorPath,       
    DesignType:{ connect: { idDesignType: +idDesignType } },
      }

   
      const createdDesignColors = await createDesignColors(data);

      res.json({
        status: true,
        data: createdDesignColors,
      });
    } catch (error) {
  
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser el color del diseño',
        },
      });
    }
  };


  exports.updateDesignColors =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idDesignColors,DesignColorName, DesignColorPath,  idDesignType,  } = req.body
  
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const  data= {
        idDesignColors:+idDesignColors,
        DesignColorName,
        DesignColorPath,
    
      DesignType:{ connect: { idDesignType: +idDesignType } },    }

  
      updateDesignColors(data, (err, result) => {
      if (err) {
        return res.status(500).json({
          status: false,
          error: err,
        });
      }
      
  
  
      res.json({
        status: true,
        user: result,
      });
    });
  };
//sin uso






