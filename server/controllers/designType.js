const {
    createDesignType,updateDesignType, getAllDesignType
  
  } = require("../models/designType");
  





exports.createDesignType = async(req, res) => {

    try {
    const { DesignTypeName, DesignTypeIconPath} = req.body
  const  data= {
    DesignTypeName,
    DesignTypeIconPath,
    
      }

   
      const createdDesignType = await createDesignType(data);

      res.json({
        status: true,
        data: createdDesignType,
      });
    } catch (error) {
  
      return res.status(400).json({
        ok: false,
        err: {
          message: 'No pudo ser creada el tipo de diseño',
        },
      });
    }
  };


  exports.updateDesignType =async (req, res, next) => {
    // Desestructurar los campos del cuerpo de la petición
    const {idDesignType, DesignTypeName, DesignTypeIconPath} = req.body

    // Verificar si el cuerpo de la petición existe
    if (!req.body) {
      return res.status(400).json({
        status: false,
        error: "error",
      });
    }
  
    const  data= {
        idDesignType:+idDesignType,
        DesignTypeName,
        DesignTypeIconPath,
    
    }

  
    updateDesignType(data, (err, result) => {
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

  exports.getAllDesignType  = async (req, res) => {
    try {
      const allDesignType  = await getAllDesignType();
  
   
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: 'No se pudo obtener las Design type',
      });
    }
  };
//sin uso