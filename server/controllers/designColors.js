const {
  createDesignColors,
  updateDesignColors,
  getAllDesignColors,
  getDesignColorsById,
} = require("../models/designColors");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
const fs = require("fs");
const path = require("path");
exports.createDesignColors = async (req, res) => {
  try {
    const { DesignColorName, idDesignType } = req.body;
    if (!DesignColorName || !idDesignType) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const image = await subirArchivoImagen(
      req.files.DesignColorPath,
      "uploads/DesignColors"
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
      DesignColorName,
      DesignColorPath: image,
      DesignType: { connect: { idDesignType: +idDesignType } },
    };

    const createdDesignColors = await createDesignColors(data);

    res.json({
      status: true,
      data: createdDesignColors,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser el color del diseño",
      },
    });
  }
};

exports.updateDesignColors = async (req, res, next) => {
  // Desestructurar los campos del cuerpo de la petición

  try {
    const { idDesignColors, DesignColorName, idDesignType } = req.body;

    if (!idDesignColors || !DesignColorName || !idDesignType) {
      return res.status(400).json({
        status: false,
        err: { message: "Datos de entrada incompletos" },
      });
    }

    const data = {
      idDesignColors: +idDesignColors,
      DesignColorName,
      DesignType: { connect: { idDesignType: +idDesignType } },
    };
    const designColors = await getDesignColorsById(data);

    if (req.files && req.files.DesignColorPath) {
      const image = await subirArchivoImagen(req.files.DesignColorPath, "uploads/DesignColors");
      const filePath = path.join(process.cwd(), designColors.DesignColorPath);
      fs.unlinkSync(filePath);
      data.DesignColorPath = image;
    }
    const result = await updateDesignColors(data);
    res.json({ status: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};
exports.getAllDesignColors = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allDesignColors = await getAllDesignColors();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allDesignColors,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las Design colors",
    });
  }
};
//sin uso
