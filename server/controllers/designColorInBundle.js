const {
  createDesignColorInBundle,
  
  deleteDesignColorInBundle,
  // getAllDesignColorBundleByFilters,
} = require("../models/designColorInBundle");

exports.createDesignColorInBundle = async (req, res) => {
  try {
    // Validar datos de entrada
    const {

      idDesignColorBundle,
      idDesignColors,
    } = req.body;
    if (
   
      !idDesignColorBundle ||
      !idDesignColors
    ) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
   
      DesignColorBundle: {
        connect: { idDesignColorBundle: +idDesignColorBundle },
      },
      DesignColors: {
        connect: { idDesignColors: +idDesignColors },
      },
    };

    const result = await createDesignColorInBundle(data);

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

exports.deleteDesignColorInBundle = async (req, res, next) => {
  try {
    // Verificar si el cuerpo de la petición existe
    const { idDesignColorInBundle } = req.body;

    if (!idDesignColorInBundle) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      idDesignColorInBundle: +idDesignColorInBundle,
    };
    const DesignColorInBundle = await deleteDesignColorInBundle(data);

    res.json({ status: true, data });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};


//sin uso
