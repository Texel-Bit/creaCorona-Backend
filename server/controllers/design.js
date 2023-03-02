const {
  createDesign,
  updateDesign,
  getAllDesign,
  getDesignById,
} = require("../models/design");
const { subirArchivoImagen } = require("../helpers/subirarchivos");

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

    const image = await subirArchivoImagen(req.files.DesignImagePath, "uploads/Design");

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

    const createdDesign = await createDesign(data);

    res.json({
      status: true,
      data: createdDesign,
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
    // Verificar si el idDesign existe
    const { idDesign } = req.body;

    const design = await getDesignById(+idDesign);

    if (!design) {
      return res.status(404).json({
        status: false,
        error: "Diseño no encontrado",
      });
    }

    // Validar datos de entrada
    const { DesignName, DesignSellPrice, idDesignType } = req.body;
    if (!DesignName || !DesignSellPrice || !idDesignType) {
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

    // Separar la lógica de subir la imagen
    if (req.files) {
      const allowedExtensions = ["jpg", "png", "jpeg"];
      const image = await subirArchivoImagen(
        req.files,
        allowedExtensions,
        "uploads/Design"
      );

      // Manejo de errores de subirArchivoImagen
      if (!image) {
        return res.status(400).json({
          status: false,
          error: "Error al subir la imagen",
        });
      }

      const filePath = path.join(process.cwd(), design.DesignImagePath);
      fs.unlinkSync(filePath);

      data.DesignImagePath = image;
    }

    const updatedDesign = await updateDesign(data);

    res.json({
      status: true,
      data: updatedDesign,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No se logró actualizar el Diseño",
      },
    });
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
