const { subirArchivoImagen } = require("../helpers/subirarchivos");
const {
    createDesignTypeFormatSize,updateDesignTypeFormatSize, getAllDesignTypeFormatSize
  
  } = require("../models/designTypeFormatSize");
  





exports.createDesignTypeFormatSize = async(req, res) => {

    try {
    const { DesignTypeFormatSizeName,idDesignType,DesignTypeFormatSizeHeight,DesignTypeFormatSizeWidht,DesignTypeFormatSizeMosaicScale  } = req.body

    if (!DesignTypeFormatSizeName || !idDesignType|| !DesignTypeFormatSizeHeight|| !idDesignType|| !DesignTypeFormatSizeMosaicScale ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    
 
  const  data= {
    DesignTypeFormatSizeName,
    DesignTypeFormatSizeHeight:DesignTypeFormatSizeHeight,
    DesignTypeFormatSizeWidht:DesignTypeFormatSizeWidht, 
    DesignTypeFormatSizeMosaicScale:DesignTypeFormatSizeMosaicScale,      
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
          message: 'No pudo ser creado el diseño formato diseño',
        },
      });
    }
  };


  exports.updateDesignTypeFormatSize =async (req, res, next) => {
    try {

    // Desestructurar los campos del cuerpo de la petición
    const {idDesignTypeFormatSize,DesignTypeFormatSizeName, DesignTypeFormatSizeHeight, DesignTypeFormatSizeWidht, idDesignType,DesignTypeFormatSizeMosaicScale  } = req.body
    if (!idDesignTypeFormatSize || !DesignTypeFormatSizeName || !DesignTypeFormatSizeHeight || !DesignTypeFormatSizeWidht ||!idDesignType||!DesignTypeFormatSizeMosaicScale) {
      return res.status(400).json({
        status: false,
        error: "Datos de entrada incompletos",
      });
    }
  
    const  data= {
        idDesignTypeFormatSize:+idDesignTypeFormatSize,
        DesignTypeFormatSizeName,
        DesignTypeFormatSizeHeight:DesignTypeFormatSizeHeight,
        DesignTypeFormatSizeWidht:DesignTypeFormatSizeWidht, 
        DesignTypeFormatSizeMosaicScale:+DesignTypeFormatSizeMosaicScale,
      DesignType:{ connect: { idDesignType: +idDesignType } },    }

      const result = await updateDesignTypeFormatSize(data);
console.log(result);
      res.json({ status: true, data: result });

  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};


  exports.getAllDesignTypeFormatSize  = async (req, res) => {
    try {
      const allDesignTypeFormatSize  = await getAllDesignTypeFormatSize();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignTypeFormatSize,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({

        status:false,
        message: 'No se pudo obtener las Design type format size',
      });
    }
  };
//sin uso






