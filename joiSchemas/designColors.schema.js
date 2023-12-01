const joi = require('@hapi/joi');

exports.createDesignColorsSchema = joi.object({

    DesignColorName: joi.string().alphanum().min(3).max(45).required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().required(),
});

exports.DesignColorPathSchema = joi.object({

    mimetype: joi.string().valid('image/jpeg', 'image/png').required(),
    size: joi.number().max(1920 * 1080).required()
}) .unknown(true);

exports.updateDesignColorsSchema = joi.object({

    DesignColorName: joi.string().alphanum().min(3).max(45).optional(),
    DesignType_idDesignType: joi.number().integer().positive().optional(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().optional(),
});


