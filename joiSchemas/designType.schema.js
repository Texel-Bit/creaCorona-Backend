const joi = require('@hapi/joi');

exports.createDesignTypeSchema = joi.object({

    DesignTypeName: joi.string().alphanum().min(3).max(45).required(),
    MosaicType_idMosaicType: joi.number().integer().positive().required(),
});

exports.updateDesignTypeSchema = joi.object({

    DesignTypeName: joi.string().alphanum().min(3).max(45).optional(),
    MosaicType_idMosaicType: joi.number().integer().positive().optional(),
});

exports.getAllDesignTypeTestSchema = joi.object({

    idDesignType: joi.number().integer().positive().required(),
    idEnvironmentType: joi.number().integer().positive().required(),
});