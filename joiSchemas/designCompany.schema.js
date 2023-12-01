const joi = require('@hapi/joi');

exports.createDesignCompanySchema = joi.object({

    DesignCompanyBuyPrice: joi.number().positive().required(),
    Company_idCompany: joi.number().integer().positive().required(),
    Design_idDesign: joi.number().integer().positive().required(),
});

exports.updateDesignCompanySchema = joi.object({

    DesignCompanyBuyPrice: joi.number().positive().required(),
    Company_idCompany: joi.number().integer().positive().optional(),
    Design_idDesign: joi.number().integer().positive().optional(),
});


