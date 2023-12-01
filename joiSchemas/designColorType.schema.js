const joi = require('@hapi/joi');

exports.createDesignColorTypehasDesignTypeSchema = joi.object({

    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().required(),
});

exports.getDesignColorTypeByDesignTypeSchema = joi.object({

    DesignType_idDesignType: joi.number().integer().positive().required(),

})