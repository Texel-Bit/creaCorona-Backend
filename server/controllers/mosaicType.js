const {

    getAllMosaicType,
    
  } = require("../models/mosaicType");
  exports.getAllMosaicType = async (req, res) => {
    try {
      const allMosaicType= await getAllMosaicType();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allMosaicType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener las Environment",
      });
    }
  };