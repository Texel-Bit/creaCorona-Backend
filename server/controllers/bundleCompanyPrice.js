const Joi = require('@hapi/joi');
const {
  createBundleCompanyPrice,
  updateBundleCompanyPrice,
  getAllBundleCompanyPrice,
} = require("../models/bundleCompanyPrice.js");

const fs = require("fs");
const path = require("path");

exports.createBundleCompanyPrice = async (req, res) => {
  const schema = Joi.object({
    idbundle: Joi.number().required(),
    idcompanyZone: Joi.number().required(),
    idcompanyType: Joi.number().required(),
    price: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { idbundle, idcompanyZone, idcompanyType, price } = req.body;

    const data = {
      bundle: { connect: { idbundle: +idbundle } },
      companyZone: { connect: { idcompanyZone: +idcompanyZone } },
      companyType: { connect: { idcompanyType: +idcompanyType } },
      price: +price
    };

    const createdBundleCompanyPrice = await createBundleCompanyPrice(data);
    res.json({
      status: true,
      data: createdBundleCompanyPrice,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      err: {
        message: 'No pudo ser creada el tipo de diseño',
      },
    });
  }
};

exports.updateBundleCompanyPrice = async (req, res, next) => {
  const schema = Joi.object({
    idbundleCompanyPrice: Joi.number().required(),
    idbundle: Joi.number().required(),
    idcompanyZone: Joi.number().required(),
    idcompanyType: Joi.number().required(),
    price: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ status: false, err: { message: error.details[0].message } });
  }

  try {
    const { idbundleCompanyPrice, idbundle, idcompanyZone, idcompanyType, price } = req.body;

    const data = {
      bundle: { connect: { idbundle: +idbundle } },
      companyZone: { connect: { idcompanyZone: +idcompanyZone } },
      companyType: { connect: { idcompanyType: +idcompanyType } },
      price: +price,
      idbundleCompanyPrice: +idbundleCompanyPrice
    };

    const result = await updateBundleCompanyPrice(data);
    res.json({ status: true, data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ status: false, error });
  }
};

exports.getAllBundleCompanyPrice = async (req, res) => {
  try {
    const allBundleCompanyPrice = await getAllBundleCompanyPrice();
    res.json({
      status: true,
      data: allBundleCompanyPrice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: 'No se pudo obtener las Design type',
    });
  }
};
