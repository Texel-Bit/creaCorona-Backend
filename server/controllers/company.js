const {
  createCompany,
  updateCompany,
  getAllCompany,
  getCompanyById,
} = require("../models/company");

const { subirArchivoImagen } = require("../helpers/subirarchivos");

const fs = require("fs");
const path = require("path");

exports.createCompany = async (req, res) => {
  try {
    const {
      CompanyName,
      CompanyAddress,
      CompanyNIT,
      CompanyPhone,
      idcompanyStatus,
      idCompanyRole,
    } = req.body;

    if (
      !CompanyName ||
      !CompanyAddress ||
      !CompanyNIT ||
      !CompanyPhone ||
      !idcompanyStatus ||
      !idCompanyRole
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
      CompanyNIT,
      CompanyPhone,
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
      CompanyNIT,
      CompanyPhone,
      idcompanyStatus,
      idCompanyRole,
    } = req.body;

    if (
      !idCompany ||
      !CompanyName ||
      !CompanyAddress ||
      !CompanyNIT ||
      !CompanyPhone ||
      !idcompanyStatus ||
      !idCompanyRole
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
      CompanyPhone,
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
      fs.unlinkSync(filePath);
      data.CompanyImagePath = image;
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
