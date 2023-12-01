const joi = require('@hapi/joi');

exports.createDesignColorInBundleSchema = joi.object({

    DesignColorBundle_idDesignColorBundle: joi.number().integer().positive().required(),
    DesignColors_idDesignColors: joi.number().integer().positive().required()
});