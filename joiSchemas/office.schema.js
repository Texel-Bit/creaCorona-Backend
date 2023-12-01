const joi = require('@hapi/joi');

exports.createOfficeSchema = joi.object({

    officeDescription: joi.string().min(3).max(45).required(),
    Company_idCompany: joi.number().integer().positive().required(),
    state_idstate: joi.number().integer().positive().required(),
    status: joi.number().integer().positive().required(),
    
});

exports.updateOfficeSchema = joi.object({

    officeDescription: joi.string().min(3).max(45).optional(),
    Company_idCompany: joi.number().integer().positive().optional(),
    state_idstate: joi.number().integer().positive().optional(),
    status: joi.number().integer().positive().required(),
});


