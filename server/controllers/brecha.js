const Joi = require('@hapi/joi');
const CircuitBreakerHandler = require('../helpers/CircuitBreakerHandler');

const {
  createBrecha,
  updateBrecha,
  getAllBrecha,
  getBrechaById,
} = require("../models/brecha");

const createBrechaBreaker = CircuitBreakerHandler.createBreaker(createBrecha);
const updateBrechaBreaker = CircuitBreakerHandler.createBreaker(updateBrecha);
const getAllBrechaBreaker = CircuitBreakerHandler.createBreaker(getAllBrecha);
const getBrechaByIdBreaker = CircuitBreakerHandler.createBreaker(getBrechaById);

const { subirArchivoImagen } = require("../helpers/subirarchivos");
const path = require('path');
const fs = require('fs');

exports.createBrecha = async (req, res) => {
  const schema = Joi.object({
    brechaName: Joi.string().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { brechaName } = req.body;

    const image = await subirArchivoImagen(
      req.files.brechaColorPath,
      "uploads/Brecha"
    );

    if (!image) {
      return res.status(400).json({
        status: false,
        err: {
          message: "Error al subir la imagen",
        },
      });
    }
    
    const data = {
      brechaName,
      brechaColorPath: image,
    };

    const createdBrecha = await createBrechaBreaker.fire(data);

    res.json({
      status: true,
      data: createdBrecha,
    });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser creada la brecha ${error}", req);
    return res.status(400).json({
      ok: false,
      err: {
        message: "No pudo ser creada la brecha",
      },
    });
  }
};

exports.updateBrecha = async (req, res, next) => {
  const schema = Joi.object({
    idbrecha: Joi.number().required(),
    brechaName: Joi.string().required(),
    brechaColorPath: Joi.string().optional()
  });

  console.log(req.body)
  const { error } = schema.validate(req.body);
  if (error) {
    CircuitBreakerHandler.logToFile(`No pudo ser actualizada la brecha ${error}`, req);
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { idbrecha, brechaName } = req.body;

    const data = {
      idbrecha: +idbrecha,
      brechaName,
    };

    const brecha = await getBrechaByIdBreaker.fire(data);

    if (req.files && req.files.brechaColorPath) {
      const image = await subirArchivoImagen(req.files.brechaColorPath, "uploads/Brecha");
      const filePath=path.join(__dirname, brecha.brechaColorPath);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      data.brechaColorPath = image;
    }

    const result = await updateBrechaBreaker.fire(data);
    res.json({ status: true, data: result });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No pudo ser actualizada la brecha ${error}", req);
    res.status(500).json({ status: false, error });
  }
};

exports.getAllBrecha = async (req, res) => {
  try {
    const allBrecha = await getAllBrechaBreaker.fire();
    res.json({
      status: true,
      data: allBrecha,
    });
  } catch (error) {
    CircuitBreakerHandler.logToFile("No se pudo obtener las brechas ${error} ", req);
    console.error(error);
    res.status(500).send({
      message: "No se pudo obtener las brechas",
    });
  }
};
