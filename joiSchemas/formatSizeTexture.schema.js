const joi = require('@hapi/joi');

exports.createFormatSizeTextureSchema = joi.object({

    DesignTypeFormatSize_idDesignTypeFormatSize: joi.number().integer().positive().required(),
    FormatSizeTextureName: joi.string().alphanum().min(3).max(45).required(),
});

exports.updateFormatSizeTextureSchema = joi.object({

    DesignTypeFormatSize_idDesignTypeFormatSize: joi.number().integer().positive().optional(),
    FormatSizeTextureName: joi.string().alphanum().min(3).max(45).optional(),
});




