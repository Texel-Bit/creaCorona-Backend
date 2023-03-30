const {
    createCompanyType,
    updateCompanyType,
    getAllCompanyType,
 
  } = require("../models/companyType.js");
  

  
  exports.createCompanyType = async (req, res) => {
    try {
      const { companyTypeDescription } = req.body;
      if (!companyTypeDescription) {
        return res.status(400).json({
          status: false,
          err: {
            message: "Datos de entrada incompletos",
          },
        });
      }
  
    
      const data = {
        companyTypeDescription,
      };
  
      const createdCompanyType = await createCompanyType(data);
  
      res.json({
        status: true,
        data: createdCompanyType,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No pudo ser creada el tipo de compañia",
        },
      });
    }
  };
  
  exports.updateCompanyType = async (req, res, next) => {
    try {
    // Desestructurar los campos del cuerpo de la petición
    const { idcompanyType, companyTypeDescription } = req.body;
    if (!idcompanyType||!companyTypeDescription) {
      return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
    }
  
    const data = {
        idcompanyType: +idcompanyType,
        companyTypeDescription,
    };
    

   
      const result = await updateCompanyType(data);
      res.json({ status: true, data: result });
    } catch (error) {
  
      res.status(500).json({ status: false, error });
    }
  
  };
  
  exports.getAllCompanyType = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allCompanyType = await getAllCompanyType();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allCompanyType,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener los tipos de compañia",
      });
    }
  };
  //sin uso
  