const {
  createFormatSizeTexture,
  updateFormatSizeTexture,
  getAllFormatSizeTexture,
  getFormatSizeTextureById,
} = require("../models/formatSizeTexture");

exports.createFormatSizeTexture = async (req, res) => {
  try {
    const { FormatSizeTextureName, idDesignTypeFormatSize } = req.body;

    const image = await subirArchivoImagen(
      req.files,
      ["jpg", "png", "jpeg"],
      "uploads/FormatSizeTexture"
    );

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
        message: "No pudo ser el color del diseño",
      },
    });
  }
};

exports.updateFormatSizeTexture = async (req, res, next) => {
  // Desestructurar los campos del cuerpo de la petición
  const {
    idFormatSizeTexture,
    FormatSizeTextureName,
    FormatSizeTextureMaskPath,
    idDesignTypeFormatSize,
  } = req.body;

  // Verificar si el cuerpo de la petición existe
  if (!req.body) {
    return res.status(400).json({
      status: false,
      error: "error",
    });
  }

  const data = {
    idFormatSizeTexture: +idFormatSizeTexture,
    FormatSizeTextureName,
    FormatSizeTextureMaskPath,
    DesignTypeFormatSize: {
      connect: { idDesignTypeFormatSize: +idDesignTypeFormatSize },
    },
  };
  if (req.files) {
    const image = await subirArchivoImagen(
      req.files,
      ["jpg", "png", "jpeg"],
      "uploads/FormatSizeTexture"
    );

    const formatSizeTexture = await getFormatSizeTextureById(data);

    const filePath = path.join(process.cwd(), formatSizeTexture.FormatSizeTextureMaskPath);

    (data.FormatSizeTextureMaskPath = image), fs.unlinkSync(filePath);
  }
  updateFormatSizeTexture(data, (err, result) => {
    if (err) {
      return res.status(500).json({
        status: false,
        error: err,
      });
    }

    res.json({
      status: true,
      user: result,
    });
  });
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
