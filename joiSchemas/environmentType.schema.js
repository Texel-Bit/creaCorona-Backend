const joi = require('@hapi/joi');

exports.createEnvironmentTypeSchema = joi.object({

    EnvironmentTypeName: joi.string().alphanum().min(6).max(45).required(),
    WorkWithStructure: joi.boolean().required(),
    EnvironmentTypeIcon: joi.string().alphanum().min(8).max(16).optional()

});

exports.createDesignTypeEnvironmentTypeSchema = joi.object({

    DesignType_idDesignType: joi.number().integer().positive().required(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required()

});

exports.createDesignTypeFormatSizeForEnvironmentTypeSchema = joi.object({

    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    formatsSize: joi.array().required()
});

exports.addDesignColorTypeToEnvironmentTypeSchema = joi.object({
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.array().required()
});

exports.EnvironmentTypeProfileImageSchema = joi.object({

    mimetype: joi.string().valid('image/jpeg', 'image/png').required(),
    size: joi.number().max(1920 * 1080).required()
}) .unknown(true);

exports.updateEnvironmentTypeSchema = joi.object({

    EnvironmentTypeName: joi.string().alphanum().min(6).max(45).required(),
    WorkWithStructure: joi.boolean().required(),
    EnvironmentTypeIcon: joi.string().alphanum().min(8).max(16).optional()

});

exports.getDesignColorTypesByEnvironmentIdAndDesignTypeSchema = joi.object({

    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    DesignType_idDesignType: joi.number().integer().positive().required()

});

exports.deleteDesignTypeFormatSizeForEnvironmentTypeSchema = joi.object({

    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    DesignTypeFormatSize_idDesignTypeFormatSize: joi.number().integer().positive().required()

})
