const Joi = require('@hapi/joi');
const CircuitBreakerHandler = require('../helpers/CircuitBreakerHandler');


const {
  createCompany,
  updateCompany,
  getAllCompany,
  getCompanyById,
} = require("../models/company");
const path = require('path');
const fs = require('fs');
const { subirArchivoImagen } = require("../helpers/subirarchivos");

const createCompanyBreaker = CircuitBreakerHandler.createBreaker(createCompany);
const updateCompanyBreaker = CircuitBreakerHandler.createBreaker(updateCompany);
const getAllCompanyBreaker = CircuitBreakerHandler.createBreaker(getAllCompany);
const getCompanyByIdBreaker = CircuitBreakerHandler.createBreaker(getCompanyById);
const subirArchivoImagenBreaker = CircuitBreakerHandler.createBreaker(subirArchivoImagen);


exports.createCompany = async (req, res) => {
  const schema = Joi.object({
    CompanyName: Joi.string().required(),
    CompanyAddress: Joi.string().required(),
    CompanyNIT: Joi.string().required(),
    CompanyEmail: Joi.string().email().required(),
    CompanyContactName: Joi.string().required(),
    CompanyPhone: Joi.string().required(),
    idcompanyStatus: Joi.number().required(),
    idCompanyRole: Joi.number().required(),
    idcompanyType: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      status: false,
      err: { message: error.details[0].message },
    });
  }

  try {
    
    const image = await subirArchivoImagenBreaker.fire(req.files.CompanyImagePath, "uploads/Company");
    // Manejo de errores de subirArchivoImagen
    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
    const data = {
      CompanyName,
      CompanyAddress,
      CompanyImagePath: image,
      CompanyCode,
      CompanyNIT,
      CompanyPhone,
      companyType: { connect: { idcompanyType: +idcompanyType } },

      companyStatus: { connect: { idcompanyStatus: +idcompanyStatus } },
      CompanyRole: { connect: { idCompanyRole: +idCompanyRole } },
    };

    const createdCompany = await createCompanyBreaker.fire(data);

    res.json({
      status: true,
      data: createdCompany,
    });

  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser creada la compañia", req);
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creada la compañia",
      },
    });

  }
};

exports.updateCompany = async (req, res, next) => {
  const schema = Joi.object({
    idCompany: Joi.number().required(),
    CompanyName: Joi.string().required(),
    CompanyAddress: Joi.string().required(),
    CompanyNIT: Joi.string().required(),
    CompanyEmail: Joi.string().email().required(),
    CompanyContactName: Joi.string().required(),
    CompanyPhone: Joi.string().required(),
    idcompanyStatus: Joi.number().required(),
    idCompanyRole: Joi.number().required(),
    idcompanyType: Joi.number().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    
    return res.status(400).json({
      status: false,
      err: { message: error.details[0].message },
    });
  }

  try {
   
    const data = {
      idCompany: +idCompany,
      CompanyName,
      CompanyAddress,
      CompanyNIT,
      CompanyCode,
      CompanyEmail,
      CompanyContactName,
      CompanyPhone,
      companyType: { connect: { idcompanyType: +idcompanyType } },

      
      companyStatus: { connect: { idcompanyStatus: +idcompanyStatus } },
      CompanyRole: { connect: { idCompanyRole: +idCompanyRole } },
    };
    const company = await getCompanyByIdBreaker.fire(data);

    if (req.files && req.files.CompanyImagePath) {

      const image = await subirArchivoImagenBreaker.fire(req.files.CompanyImagePath, "uploads/Company");


      const filePath=path.join(__dirname, company.CompanyImagePath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      }      data.CompanyImagePath = image;
    }

    const result = await updateCompanyBreaker.fire(data);
    res.json({ status: true, data: result });

  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser actualizada la compañia", req);

    res.status(500).json({ status: false, error });

  }
};

exports.getAllCompany = async (req, res) => {
  try {
    const allCompany = await getAllCompanyBreaker.fire();
    res.json({
      status: true,
      data: allCompany,
    });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser actualizada la compañia", req);

    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las compañias",
    });
  }
};
