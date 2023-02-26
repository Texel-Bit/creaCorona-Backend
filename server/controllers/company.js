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
  const image = await subirArchivoImagen(
    req.files,
    ["jpg", "png", "jpeg"],
    "uploads/Company"
  );

  try {
    const {
      CompanyName,
      CompanyAddress,
      CompanyNIT,
      CompanyPhone,
      idcompanyStatus,
      idCompanyRole,
    } = req.body;
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
    } = req.body ?? {};

    if (!idCompany) {
      return res.status(400).json({
        status: false,
        error: "idCompany is required",
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


    if (req.files) {
      const image = await subirArchivoImagen(
        req.files,
        ["jpg", "png", "jpeg"],
        "uploads/Company"
      );

      const company = await getCompanyById(data);

   
      const filePath = path.join(process.cwd(), company.CompanyImagePath);

      
      (data.CompanyImagePath = image), fs.unlinkSync(filePath);
    }

   

    await updateCompany(data);

    res.json({
      status: true,
    });
  } catch (err) {
    if (err.code === "ENOENT") {
      return res.status(400).json({
        status: false,
        error: "File not found",
      });
    }
    res.status(500).json({
      status: false,
      error: err.message,
    });
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
