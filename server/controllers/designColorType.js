const {

    getAllDesignColorType,
    
  } = require("../models/designColorType");
  exports.getAllDesignColorType = async (req, res) => {
    try {
      const allDesignColorType= await getAllDesignColorType();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allDesignColorType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener los designColorType",
      });
    }
  };