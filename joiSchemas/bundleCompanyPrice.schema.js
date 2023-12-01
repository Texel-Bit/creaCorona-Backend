const joi = require('@hapi/joi');

exports.createBundleCompanyPriceSchema = joi.object({

    bundle_idbundle: joi.number().integer().positive().required(),
    companyZone_idcompanyZone: joi.number().integer().positive().required(),
    companyType_idcompanyType: joi.number().integer().positive().required(),
    price: joi.number().positive().required(),
    
});

exports.updateBundleCompanyPriceSchema = joi.object({

    companyZone_idcompanyZone: joi.number().integer().positive().optional(),
    companyType_idcompanyType: joi.number().integer().positive().optional(),
    price: joi.number().positive().optional(),

});
