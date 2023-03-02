const {
  createDesignColors,
  updateDesignColors,
  getAllDesignColors,
  getDesignColorsById,
} = require("../models/designColors");

exports.createDesignColors = async (req, res) => {
  try {
    const { DesignColorName,  idDesignType } = req.body;
    if (!DesignColorName || !idDesignType) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const image = await subirArchivoImagen(req.files.DesignColorPath, "uploads/DesignColors");
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
      DesignColorPath:image,
      DesignType: { connect: { idDesignType: +idDesignType } },
    };

    const createdDesignColors = await createDesignColors(data);

    res.json({
      status: true,
      data: createdDesignColors,
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

exports.updateDesignColors = async (req, res, next) => {
  // Desestructurar los campos del cuerpo de la petición
  const { idDesignColors, DesignColorName, idDesignType } = req.body;

  // Verificar si el cuerpo de la petición existe
  if (!req.body) {
    return res.status(400).json({
      status: false,
      error: "error",
    });
  }

  const data = {
    idDesignColors: +idDesignColors,
    DesignColorName,

    DesignType: { connect: { idDesignType: +idDesignType } },
  };

  if (req.files) {
    const image = await subirArchivoImagen(
      req.files,
      ["jpg", "png", "jpeg"],
      "uploads/DesignColors"
    );

    const designColors = await getDesignColorsById(data);

    const filePath = path.join(process.cwd(), designColors.DesignColorPath);

    (data.DesignColorPath = image), fs.unlinkSync(filePath);
  }
  updateDesignColors(data, (err, result) => {
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
