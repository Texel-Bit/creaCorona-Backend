const {
  createEnvironment,
  updateEnvironment,
  getAllEnvironment,
  getEnvironmentById,
} = require("../models/environment");

const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');

exports.createEnvironment = async (req, res) => {
  try {
    const { EnvironmentName, idEnvironmentType, EnvironmentAngle } = req.body;
    if (!EnvironmentName || !idEnvironmentType || !EnvironmentAngle) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(
      req.files.EnvironmentProfileImage,

      "uploads/Environment"
    );

    const imageMask = await subirArchivoImagen(
      req.files.EnvironmentMaksImage,

      "uploads/Environment"
    );

    if (!image || !imageMask) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
    const data = {
      EnvironmentName,
      EnvironmentProfileImage: image,
      EnvironmentMaksImage: imageMask,
      EnvironmentAngle: EnvironmentAngle,
      EnvironmentType: { connect: { idEnvironmentType: +idEnvironmentType } },
    };

    const createdEnvironment = await createEnvironment(data);
    res.json({
      status: true,
      data: createdEnvironment,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser el Ambiente",
      },
    });
  }
};

exports.updateEnvironment = async (req, res, next) => {
  try {
    // Desestructurar los campos del cuerpo de la petición
    const {
      idEnvironment,
      EnvironmentName,
      idEnvironmentType,
      EnvironmentAngle,
    } = req.body;

    if (
      !idEnvironment ||
      !EnvironmentName ||
      !idEnvironmentType ||
      !EnvironmentAngle
    ) {
      return res.status(400).json({
        status: false,
        err: { message: "Datos de entrada incompletos" },
      });
    }
    const data = {
      idEnvironment: +idEnvironment,
      EnvironmentName,
      EnvironmentAngle,
      EnvironmentType: { connect: { idEnvironmentType: +idEnvironmentType } },
    };

    const environment = await getEnvironmentById(data);
    if (req.files && req.files.EnvironmentProfileImage) {
      const image = await subirArchivoImagen(
        req.files.EnvironmentProfileImage,
        "uploads/Environment"
      );
      const filePath = path.join(
        process.cwd(),
        environment.EnvironmentProfileImage
      );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      } 
      data.EnvironmentProfileImage = image;
    }

    if (req.files && req.files.EnvironmentMaksImage) {
      const imageMask = await subirArchivoImagen(
        req.files.EnvironmentMaksImage,
        "uploads/Environment"
      );

      const filePath = path.join(
        process.cwd(),
        environment.EnvironmentMaksImage
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync();
      }

      data.EnvironmentMaksImage = imageMask;
    }

    const result = await updateEnvironment(data);
    res.json({ status: true, data: result });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};

exports.getAllEnvironment = async (req, res) => {
  try {
    const allEnvironment = await getAllEnvironment();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allEnvironment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las Environment",
    });
  }
};
//sin uso
