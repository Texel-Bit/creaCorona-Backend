const {
  createFormatSizeTexture,
  updateFormatSizeTexture,
  getAllFormatSizeTexture,
  getFormatSizeTextureById,
} = require("../models/formatSizeTexture");
const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');
exports.createFormatSizeTexture = async (req, res) => {
  try {
    const { FormatSizeTextureName, idDesignTypeFormatSize } = req.body;
    if (!FormatSizeTextureName || !idDesignTypeFormatSize) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    const image = await subirArchivoImagen(
      req.files.FormatSizeTextureMaskPath,
      "uploads/FormatSizeTexture"
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
      FormatSizeTextureName,
      FormatSizeTextureMaskPath: image,
      DesignTypeFormatSize: {
        connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize },
      },
    };

    const createdFormatSizeTexture = await createFormatSizeTexture(data);

    res.json({
      status: true,
      data: createdFormatSizeTexture,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No pudo ser creado el formato  tamaño textura",
      },
    });
  }
};

exports.updateFormatSizeTexture = async (req, res, next) => {
  try {

  // Desestructurar los campos del cuerpo de la petición
  const {
    idFormatSizeTexture,
    FormatSizeTextureName,
    
    idDesignTypeFormatSize,
  } = req.body;

  if (!idFormatSizeTexture||!FormatSizeTextureName||!idDesignTypeFormatSize) {
    return res.status(400).json({ status: false, err: { message: "Datos de entrada incompletos" } });
  }

  const data = {
    idFormatSizeTexture: +idFormatSizeTexture,
    FormatSizeTextureName,
        DesignTypeFormatSize: {
      connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize },
    },
  };
  const formatSizeTexture = await getFormatSizeTextureById(data);

  if (req.files && req.files.FormatSizeTextureMaskPath) {
    const image = await subirArchivoImagen(
      req.files.FormatSizeTextureMaskPath,
      "uploads/FormatSizeTexture"
    );

    const filePath = path.join(process.cwd(), formatSizeTexture.FormatSizeTextureMaskPath);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync();
    }    data.FormatSizeTextureMaskPath = image;
  }  
  
  const result = await updateFormatSizeTexture(data);

  res.json({ status: true, data: result });
} catch (error) {

  res.status(500).json({ status: false, error });
}

};

exports.getAllFormatSizeTexture = async (req, res) => {
  try {
    const allFormatSizeTexture = await getAllFormatSizeTexture();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allFormatSizeTexture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las allFormatSizeTexture",
    });
  }
};
//sin uso
