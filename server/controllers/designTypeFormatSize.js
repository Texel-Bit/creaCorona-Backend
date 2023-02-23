const {
    createDesignTypeFormatSize,updateDesignTypeFormatSize
  
  } = require("../models/designTypeFormatSize");
  





exports.createDesignTypeFormatSize = async(req, res) => {

    try {
    const { DesignTypeFormatSizeName, DesignTypeFormatSizeHeight, DesignTypeFormatSizeWidht,idDesignType  } = req.body
  const  data= {
    DesignTypeFormatSizeName,
    DesignTypeFormatSizeHeight:+DesignTypeFormatSizeHeight,
    DesignTypeFormatSizeWidht:+DesignTypeFormatSizeHeight,       
    DesignType:{ connect: { idDesignType: +idDesignType } },
      }

   
      const createdDesignTypeFormatSize = await createDesignTypeFormatSize(data);

      res.json({
        status: true,
        data: createdDesignTypeFormatSize,
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


  exports.updateDesignTypeFormatSize =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idDesignTypeFormatSize,DesignTypeFormatSizeName, DesignTypeFormatSizeHeight, DesignTypeFormatSizeWidht, idDesignType,  } = req.body
  
    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const  data= {
        idDesignTypeFormatSize:+idDesignTypeFormatSize,
        DesignTypeFormatSizeName,
        DesignTypeFormatSizeHeight:+DesignTypeFormatSizeHeight,
        DesignTypeFormatSizeWidht:+DesignTypeFormatSizeHeight, 
      DesignType:{ connect: { idDesignType: +idDesignType } },    }

  
      updateDesignTypeFormatSize(data, (err, result) => {
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






