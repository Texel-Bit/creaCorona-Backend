const joi = require('@hapi/joi');

exports.createDesignColorBundleSchema = joi.object({

    DesignColorBundleName: joi.string().alphanum().min(3).max(45).required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().required(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
});

exports.updateDesignColorBundleSchema = joi.object({

    DesignColorBundleName: joi.string().alphanum().min(3).max(45).optional(),
    DesignType_idDesignType: joi.number().integer().positive().optional(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().optional(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().optional(),
});

exports.getAllDesignColorBundleByFiltersSchema = joi.object({

    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().required(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
})
