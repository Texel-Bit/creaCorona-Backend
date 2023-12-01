const joi = require('@hapi/joi');

exports.createBundleSchema = joi.object({

    bundleBasePrice: joi.number().positive().required(),
    FormatSizeTexture_idFormatSizeTexture: joi.number().integer().positive().required(),
    
});

exports.updateBundleSchema = joi.object({

    bundleBasePrice: joi.number().positive().optional(),
    FormatSizeTexture_idFormatSizeTexture: joi.number().integer().positive().optional(),

});
