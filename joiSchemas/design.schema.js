const joi = require('@hapi/joi');

exports.createDesignSchema = joi.object({

    DesignName: joi.string().alphanum().min(3).max(45).required(),
    DesignSellPrice: joi.number().positive().required(),
    DesignType_idDesignType: joi.number().integer().positive().required(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().required(),
});

exports.updateDesignSchema = joi.object({

    DesignName: joi.string().alphanum().min(3).max(45).optional(),
    DesignSellPrice: joi.number().positive().optional(),
    DesignType_idDesignType: joi.number().integer().positive().optional(),
    DesignColorType_idDesignColorType: joi.number().integer().positive().optional(),
});


