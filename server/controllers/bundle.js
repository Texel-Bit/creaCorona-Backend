const CircuitBreakerHandler = require('../helpers/CircuitBreakerHandler');
const Joi = require('@hapi/joi');

const {
  createBundle,
  getAllBundle,
  updateBundle,
  getBundleDesignTypeFormatSizeTexture,
} = require("../models/bundle");

// Create circuit breakers for each function.
const createBundleBreaker = CircuitBreakerHandler.createBreaker(createBundle);
const updateBundleBreaker = CircuitBreakerHandler.createBreaker(updateBundle);
const getAllBundleBreaker = CircuitBreakerHandler.createBreaker(getAllBundle);
const getBundleDesignTypeFormatSizeTextureBreaker = CircuitBreakerHandler.createBreaker(getBundleDesignTypeFormatSizeTexture);

exports.createBundle = async (req, res) => {

  const schema = Joi.object({
    idFormatSizeTexture: Joi.number().required(),
    bundleBasePrice: Joi.number().required(),
    idbundle: Joi.number().optional()
  });

  const { error } = schema.validate(req.body);

  if (error) {
    console.log(error)
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { idFormatSizeTexture, bundleBasePrice } = req.body;
    const data = {
      bundleBasePrice: +bundleBasePrice,
      FormatSizeTexture_idFormatSizeTexture:+idFormatSizeTexture
    };
    const valideData = {
      idFormatSizeTexture: +idFormatSizeTexture,
    };

    const valideBundle = await getBundleDesignTypeFormatSizeTextureBreaker.fire(valideData);

    if (valideBundle) {
      res.json({
        status: true,
        data: valideBundle,
        message: "Ya existe este Bundle",
      });
    } else {
      const createdBundle = await createBundleBreaker.fire(data);
      
      res.json({
        status: true,
        data: createdBundle,
      });
    }
  } catch (error) {
    console.log(error)
    CircuitBreakerHandler.logToFile("No pudo ser creado el bundle", req);
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creado el bundle",
      },
    });
  }
};

exports.updateBundle = async (req, res, next) => {
  const schema = Joi.object({
    idbundle: Joi.number().required(),
    bundleBasePrice: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { idbundle, bundleBasePrice } = req.body;
    const data = {
      idbundle: +idbundle,
      bundleBasePrice: +bundleBasePrice,
    };

    const bundle = await updateBundleBreaker.fire(data);
    res.json({ status: true, data: bundle });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser actualizado el bundle", req);
    res.status(500).json({ status: false, error });
  }
};

exports.getAllBundle = async (req, res) => {
  try {
    const allBundle = await getAllBundleBreaker.fire();
    res.json({
      status: true,
      data: allBundle,
    });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No se pudo obtener las bundle", req);
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las bundle",
    });
  }
};
