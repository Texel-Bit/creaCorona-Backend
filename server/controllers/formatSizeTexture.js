const {
  createFormatSizeTexture,updateFormatSizeTexture
  
  } = require("../models/formatSizeTexture");
  





exports.createFormatSizeTexture = async(req, res) => {

    try {
    const { FormatSizeTextureName, FormatSizeTextureMaskPath, idDesignTypeFormatSize  } = req.body
  const  data= {
    FormatSizeTextureName,
    FormatSizeTextureMaskPath,       
    DesignTypeFormatSize:{ connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize } },
      }

   
      const createdFormatSizeTexture = await createFormatSizeTexture(data);

      res.json({
        status: true,
        data: createdFormatSizeTexture,
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


  exports.updateFormatSizeTexture =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idFormatSizeTexture, FormatSizeTextureName, FormatSizeTextureMaskPath, idDesignTypeFormatSize  } = req.body

    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
  
      const  data= {
        idFormatSizeTexture:+idFormatSizeTexture,
        FormatSizeTextureName,
        FormatSizeTextureMaskPath,       
        DesignTypeFormatSize:{ connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize } },
          }
  
      updateFormatSizeTexture(data, (err, result) => {
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






