const {
  getAllDesignColorType,
  createDesignColorTypehasDesignType,
  deleteDesignColorTypehasDesignType,
} = require("../models/designColorType");
exports.getAllDesignColorType = async (req, res) => {
  try {
    const allDesignColorType = await getAllDesignColorType();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allDesignColorType,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener los designColorType",
    });
  }
};

exports.createDesignColorTypehasDesignType = async (req, res) => {
  try {
    const {
      DesignColorTypeIdDesignColorType,
      DesignTypeidDesignType,
      DesignColorTypeidEnvironmentType,
    } = req.body;
    if (
      !DesignColorTypeIdDesignColorType ||
      !DesignTypeidDesignType ||
      !DesignColorTypeidEnvironmentType
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }
    let data = []; // Inicializar data como un array vacío

    data[0] = {}; // Inicializar el primer elemento del array como un objeto vacío
        data[0].DesignColorType_IdDesignColorType =
      +DesignColorTypeIdDesignColorType;
    data[0].DesignType_idDesignType = +DesignTypeidDesignType;
    data[0].DesignColorType_idEnvironmentType =
      +DesignColorTypeidEnvironmentType;
      console.log(22);

    const createdDesignColorTypehasDesignType =
      await createDesignColorTypehasDesignType(data);

    res.json({
      status: true,
      data: createdDesignColorTypehasDesignType,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
      err: {
        message: "No pudo ser creada",
      },
    });
  }
};


exports.deleteDesignColorTypehasDesignType = async (req, res) => {
  try {
    const {
      DesignColorTypeIdDesignColorType,
      DesignTypeidDesignType,
      DesignColorTypeidEnvironmentType,
    } = req.body;
    if (
      !DesignColorTypeIdDesignColorType ||
      !DesignTypeidDesignType ||
      !DesignColorTypeidEnvironmentType
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    let data = {}; // Inicializar data como un objeto vacío

    data.DesignColorType_IdDesignColorType = +DesignColorTypeIdDesignColorType;
    data.DesignType_idDesignType = +DesignTypeidDesignType;
    data.DesignColorType_idEnvironmentType = +DesignColorTypeidEnvironmentType;
    
    const deletedDesignColorTypehasDesignType =
      await deleteDesignColorTypehasDesignType(data);

    res.json({
      status: true,
      data: deletedDesignColorTypehasDesignType,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      error,
      err: {
        message: "No pudo ser eliminada ",
      },
    });
  }
};