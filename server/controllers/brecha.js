const {
  createBrecha,
  updateBrecha,
  getAllBrecha,
  getBrechaById,
} = require("../models/brecha");

const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');

exports.createBrecha = async (req, res) => {
  try {
    const { brechaName } = req.body;
    if (!brechaName) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const image = await subirArchivoImagen(
      req.files.brechaColorPath,
      "uploads/Brecha"
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
      brechaName,
      brechaColorPath: image,
    };

    const createdBrecha = await createBrecha(data);

    res.json({
      status: true,
      data: createdBrecha,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creada la brecha",
      },
    });
  }
};

exports.updateBrecha = async (req, res, next) => {
  try {
  // Desestructurar los campos del cuerpo de la petición
  const { idbrecha, brechaName } = req.body;
  if (!brechaName||!idbrecha) {
    return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
  }

  const data = {
    idbrecha: +idbrecha,
    brechaName,
  };
  
  const brecha = await getBrechaById(data);


  if (req.files && req.files.brechaColorPath) {
    const image = await subirArchivoImagen(req.files.brechaColorPath, "uploads/Brecha");
    const filePath = path.join(process.cwd(), brecha.brechaColorPath);

    fs.unlinkSync(filePath);
    data.brechaColorPath = image;
  }

 
    const result = await updateBrecha(data);
    res.json({ status: true, data: result });
  } catch (error) {

    res.status(500).json({ status: false, error });
  }

};

exports.getAllBrecha = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allBrecha = await getAllBrecha();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allBrecha,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las brechas",
    });
  }
};
//sin uso
