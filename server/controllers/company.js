const {
  createCompany,
  updateCompany,
  getAllCompany,
  getCompanyById,
} = require("../models/company");
const path = require('path');
const fs = require('fs');
const { subirArchivoImagen } = require("../helpers/subirarchivos");



exports.createCompany = async (req, res) => {
  try {
    const {
      CompanyName,
      CompanyAddress,
      CompanyNIT,
      CompanyEmail,
      CompanyContactName,
      CompanyPhone,
      idcompanyStatus,
      idCompanyRole,
      idcompanyType
    } = req.body;

    if (
      !CompanyName ||
      !CompanyAddress ||
      !CompanyCode ||
      !CompanyNIT||
      !CompanyEmail||
      !CompanyContactName||
      !CompanyPhone ||
      !idcompanyStatus ||
      !idCompanyRole ||
      !idcompanyType
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(
      req.files.CompanyImagePath,

      "uploads/Company"
    );
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

    const createdCompany = await createCompany(data);

    res.json({
      status: true,
      data: createdCompany,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creada la compañia",
      },
    });
  }
};

exports.updateCompany = async (req, res, next) => {
  try {
    const {
      idCompany,
      CompanyName,
      CompanyAddress,
      CompanyCode,
      CompanyEmail,
      CompanyContactName,
      CompanyPhone,
      idcompanyStatus,
      idCompanyRole,
      idcompanyType,
      CompanyNIT
    } = req.body;

    if (
      !idCompany ||
      !CompanyName ||
      !CompanyEmail||
      !CompanyContactName||
      !CompanyAddress ||
      !CompanyCode ||
      !CompanyPhone ||
      !idcompanyStatus ||
      !idCompanyRole||
      !idcompanyType||
      !CompanyNIT
    ) {
      return res.status(400).json({
        status: false,
        err: { message: "Datos de entrada incompletos" },
      });
    }
    
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
    const company = await getCompanyById(data);

    if (req.files && req.files.CompanyImagePath) {
      const image = await subirArchivoImagen(
        req.files.CompanyImagePath,
        "uploads/Company"
      );
      const filePath = path.join(process.cwd(), company.CompanyImagePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      }      data.CompanyImagePath = image;
    }

    const result = await updateCompany(data);
    res.json({ status: true, data: result });
  } catch (error) {

    res.status(500).json({ status: false, error });
  }
};

exports.getAllCompany = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allCompany = await getAllCompany();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allCompany,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las compañias",
    });
  }
};
