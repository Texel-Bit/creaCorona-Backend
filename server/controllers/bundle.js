const {
  createBundle,
  getAllBundle,
  updateBundle,
  getBundleDesignTypeFormatSizeTexture,
} = require("../models/bundle");

exports.createBundle = async (req, res) => {
  try {
    const { idFormatSizeTexture, bundleBasePrice } = req.body;

    if (!idFormatSizeTexture || !bundleBasePrice) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Datos de entrada incompletos",
        },
      });
    }

    const data = {
      bundleBasePrice: +bundleBasePrice,
      FormatSizeTexture: {
        connect: { idFormatSizeTexture: +idFormatSizeTexture },
      },
    };
    const valideData = {
      idFormatSizeTexture: +idFormatSizeTexture,
    };

    const valideBundle = await getBundleDesignTypeFormatSizeTexture(valideData);

    if (valideBundle[0]) {
      res.json({
        status: true,
        data: valideBundle,
        message: "Ya existe este Bundle",
      });
    } else {
      const createdBundle = await createBundle(data);
      res.json({
        status: true,
        data: createdBundle,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creado el bundle",
      },
    });
  }
};

exports.updateBundle = async (req, res, next) => {
  try {
    // Desestructurar los campos del cuerpo de la petición
    const { idbundle, bundleBasePrice } = req.body;

    // Verificar si el cuerpo de la petición existe
    if (!idbundle || !bundleBasePrice) {
      return res.status(400).json({
        status: false,
        error: "Datos de entrada incompletos",
      });
    }
    const data = {
      idbundle: +idbundle,
      bundleBasePrice: +bundleBasePrice,
    };
    const bundle = await updateBundle(data);

    res.json({ status: true, data: bundle });
  } catch (error) {
    res.status(500).json({ status: false, error });
  }
};

exports.getAllBundle = async (req, res) => {
  try {
    const allBundle = await getAllBundle();

    // Enviar la respuesta con los usuarios
    res.json({
      status: true,
      data: allBundle,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las bundle",
    });
  }
};

//sin uso
