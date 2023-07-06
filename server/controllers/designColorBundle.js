const {
  createDesignColorBundle,
  updateDesignColorBundle,
  getAllDesignColorBundle,
  deleteDesignColorBundle,
  getAllDesignColorBundleByFilters,
} = require("../models/designColorBundle");

exports.createDesignColorBundle = async (req, res) => {
  try {
    // Validar datos de entrada
    const {
      DesignColorBundleName,
      idDesignType,
      idDesignColorType,
      idEnvironmentType,
    } = req.body;
    if (
      !DesignColorBundleName ||
      !idDesignType ||
      !idDesignColorType ||
      idEnvironmentType
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      DesignColorBundleName,
      DesignType: {
        connect: { idDesignType: +idDesignType },
      },
      DesignColorType: {
        connect: { idDesignColorType: +idDesignColorType },
      },
      EnvironmentType: {
        connect: { idEnvironmentType: +idEnvironmentType },
      },
    };

    const result = await createDesignColorBundle(data);

    res.json({
      status: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: false,
      err: {
        message: "No se logró crear el DesignColorBundle",
      },
    });
  }
};
exports.updateDesignColorBundle = async (req, res, next) => {
  try {
    // Verificar si el cuerpo de la petición existe
    const {
      idDesignColorBundle,
      DesignColorBundleName,
      idDesignType,
      idDesignColorType,
      idEnvironmentType,
    } = req.body;

    if (!idDesignColorBundle || !DesignColorBundleName) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      idDesignColorBundle: +idDesignColorBundle,
      DesignColorBundleName,
      DesignType: {
        connect: { idDesignType: +idDesignType },
      },
      DesignColorType: {
        connect: { idDesignColorType: +idDesignColorType },
      },
      EnvironmentType: {
        connect: { idEnvironmentType: +idEnvironmentType },
      },
    };
    const DesignColorBundle = await updateDesignColorBundle(data);

    res.json({ status: true, DesignColorBundle });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};
exports.deleteDesignColorBundle = async (req, res, next) => {
  try {
    // Verificar si el cuerpo de la petición existe
    const { idDesignColorBundle } = req.body;

    if (!idDesignColorBundle) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      idDesignColorBundle: +idDesignColorBundle,
    };
    const DesignColorBundle = await deleteDesignColorBundle(data);

    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};

exports.getAllDesignColorBundle = async (req, res) => {
  try {
    // Obtener todos los usuarios desde la base de datos
    const allDesignColorBundle = await getAllDesignColorBundle();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allDesignColorBundle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las Design",
    });
  }
};

exports.getAllDesignColorBundleByFilters = async (req, res, next) => {
  try {
    // Verificar si el cuerpo de la petición existe
    const {
      // idDesignColorBundle,
      // DesignColorBundleName,
      idDesignType,
      idDesignColorType,
      idEnvironmentType,
    } = req.body;

    if (!idDesignType || !idDesignColorType||!idEnvironmentType) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      // idDesignColorBundle: +idDesignColorBundle,
      // DesignColorBundleName,
      idDesignType: +idDesignType,
      idDesignColorType: +idDesignColorType,
      idEnvironmentType: +idEnvironmentType,
    };

    const DesignColorBundle = await getAllDesignColorBundleByFilters(data);

    res.json({ status: true, DesignColorBundle });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};
//sin uso
