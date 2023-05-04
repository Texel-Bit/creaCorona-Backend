
const {
  
    getAllUserRole,
 
  } = require("../models/userRole.js");

exports.getAllUserRole = async (req, res) => {
    try {
      const allUserRole = await getAllUserRole();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allUserRole,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener las oficinas",
      });
    }
  };