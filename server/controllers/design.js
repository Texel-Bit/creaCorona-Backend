const {
  createDesign,
  updateDesign,
  getAllDesign,
  getDesignById,
} = require("../models/design");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
const fs = require("fs");
const path = require("path");
exports.createDesign = async (req, res) => {
  try {
    // Validar datos de entrada
    const { DesignName, DesignSellPrice, idDesignType } = req.body;
    if (!DesignName || !DesignSellPrice || !idDesignType) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const image = await subirArchivoImagen(
      req.files.DesignImagePath,
      "uploads/Design"
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
      DesignImagePath: image,
      DesignName,
      DesignSellPrice: +DesignSellPrice,
      DesignType: { connect: { idDesignType: +idDesignType } },
    };

    const result = await createDesign(data);

    res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No se logró crear el Diseño",
      },
    });
  }
};

exports.updateDesign = async (req, res, next) => {
  try {
    // Validar datos de entrada
    const { idDesign, DesignName, DesignSellPrice, idDesignType } = req.body;
    if (!idDesign || !DesignName || !DesignSellPrice || !idDesignType) {
      return res.status(400).json({
        status: false,
        error: "Datos de entrada incompletos",
      });
    }

    const data = {
      idDesign: +idDesign,
      DesignName,
      DesignSellPrice: +DesignSellPrice,
      DesignType: { connect: { idDesignType: +idDesignType } },
    };
    const design = await getDesignById(+idDesign);

    // Separar la lógica de subir la imagen
    if (req.files && req.files.DesignImagePath) {
      const image = await subirArchivoImagen(
        req.files.DesignImagePath,
        "uploads/Design"
      );

      const filePath=path.join(__dirname, design.DesignImagePath);

      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      }      data.DesignImagePath = image;
    }

    const result = await updateDesign(data);

    res.json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};

exports.getAllDesign = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allDesign = await getAllDesign();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allDesign,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las Design",
    });
  }
};
//sin uso
