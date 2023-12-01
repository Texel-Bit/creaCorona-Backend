const joi = require('@hapi/joi');

exports.createDesignTypeFormatSizeSchema = joi.object({

    DesignTypeFormatSizeName: joi.string().alphanum().min(3).max(45).required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignTypeFormatSizeHeight: joi.string().alphanum().min(3).max(255).required(),
    DesignTypeFormatSizeWidht: joi.string().alphanum().min(3).max(255).required(),
    DesignTypeFormatSizeMosaicScale: joi.string().alphanum().min(3).max(50).required()
});

exports.updateDesignTypeFormatSizeSchema = joi.object({
    DesignTypeFormatSizeDefaultImagePath: joi.string().optional(),
    image: joi.string().optional(),
    DesignTypeFormatSizeName: joi.string().min(3).max(45).optional(),
    DesignTypeFormatSizeHeight: joi.number().positive().optional(),
    DesignTypeFormatSizeWidht:joi.number().positive().optional(),
    DesignTypeFormatSizeMosaicScale: joi.number().positive().optional()
});


