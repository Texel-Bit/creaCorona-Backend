const joi = require('@hapi/joi');

exports.createStateSchema = joi.object({

    stateName: joi.string().alphanum().min(3).max(45).required(),
    companyZone_idcompanyZone: joi.number().integer().positive().required()
});

exports.updateStateSchema = joi.object({

    stateName: joi.string().regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ !@#$%^&*()_+[\]{}|:;"'<>,.?/\\-]*$/u).min(6).max(45).optional(),
    companyZone_idcompanyZone: joi.number().integer().positive().optional(),
});