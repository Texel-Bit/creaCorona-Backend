const {
    createCompanyZone,
    updateCompanyZone,
    getAllCompanyZone
  } = require("../models/companyZone.js");
  
  const path = require('path');
  const fs = require('fs');
  
  exports.createCompanyZone = async (req, res) => {
    try {
      const { companyZoneName } = req.body;
      if (!companyZoneName) {
        return res.status(400).json({
          status: false,
          err: {
            message: "Datos de entrada incompletos",
          },
        });
      }
  
    
      const data = {
        companyZoneName,
      };
  
      const createdCompanyZone = await createCompanyZone(data);
  
      res.json({
        status: true,
        data: createdCompanyZone,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "No pudo ser creada zona de la compañia",
        },
      });
    }
  };
  


  exports.updateCompanyZone = async (req, res, next) => {
    try {
    // Desestructurar los campos del cuerpo de la petición
    const { idcompanyZone, companyZoneName } = req.body;
    if (!companyZoneName||!idcompanyZone) {
      return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
    }
  
    const data = {
        idcompanyZone: +idcompanyZone,
        companyZoneName,
    };
    
    const CompanyZone = await updateCompanyZone(data);
  
  
      res.json({ status: true, data: CompanyZone });
    } catch (error) {
  
      res.status(500).json({ status: false, error });
    }
  
  };
  
  exports.getAllCompanyZone = async (req, res) => {
    try {
      // Obtener todos los usuarios desde la base de datos
      const allCompanyZone = await getAllCompanyZone();
  
      // Enviar la respuesta con los usuarios
      res.json({
        status: true,
        data: allCompanyZone,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send({
        message: "No se pudo obtener las brechas",
      });
    }
  };


 
  //sin uso
  