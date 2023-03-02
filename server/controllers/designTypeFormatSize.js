const { subirArchivoImagen } = require("../helpers/subirarchivos");
const {
    createDesignTypeFormatSize,updateDesignTypeFormatSize, getAllDesignTypeFormatSize
  
  } = require("../models/designTypeFormatSize");
  





exports.createDesignTypeFormatSize = async(req, res) => {

    try {
    const { DesignTypeFormatSizeName,idDesignType  } = req.body

    if (!DesignTypeFormatSizeName || !idDesignType ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    
    const DesignTypeFormatSizeHeight = await subirArchivoImagen(req.files.filesHeight, "uploads/DesignTypeFormatSize");
    const DesignTypeFormatSizeWidht = await subirArchivoImagen(req.files.filesWidht, "uploads/DesignTypeFormatSize");


    if (!DesignTypeFormatSizeHeight || !DesignTypeFormatSizeWidht) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
  const  data= {
    DesignTypeFormatSizeName,
    DesignTypeFormatSizeHeight:DesignTypeFormatSizeHeight,
    DesignTypeFormatSizeWidht:DesignTypeFormatSizeWidht,       
    DesignType:{ connect: { idDesignType: +idDesignType } },
      }

   
      const createdDesignTypeFormatSize = await createDesignTypeFormatSize(data);

      res.json({
        status: true,
        data: createdDesignTypeFormatSize,
      });
    } catch (error) {
  console.log(error);
      return res.status(400).json({
        status: false,
        err: {
          message: 'No pudo ser creado el diseño formato diseño',
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
        message: 'No se pudo obtener las Design type format size',
      });
    }
  };
//sin uso






