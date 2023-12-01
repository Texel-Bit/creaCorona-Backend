const joi = require('@hapi/joi');

exports.createMosaicTypeSchema = joi.object({

    MosaicTypeName: joi.string().alphanum().min(3).max(45).required(),
    MosaicTypeValue: joi.number().integer().positive().required()
});

exports.updateMosaicTypeSchema = joi.object({

    MosaicTypeName: joi.string().alphanum().min(3).max(45).required(),
    MosaicTypeValue: joi.number().integer().positive().required()

});
