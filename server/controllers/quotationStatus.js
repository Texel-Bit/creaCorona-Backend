
const {
  
    getAllQuotationStatus,
 
  } = require("../models/quotationStatus");

exports.getAllQuotationStatus = async (req, res) => {
    try {
      const allQuotationStatus = await getAllQuotationStatus();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allQuotationStatus,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener las oficinas",
      });
    }
  };