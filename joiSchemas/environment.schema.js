const joi = require('@hapi/joi');

exports.createEnvironmentSchema = joi.object({

    EnvironmentName: joi.string().alphanum().min(6).max(45).required(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().required(),
    EnvironmentAngle: joi.string().alphanum().min(8).max(255).optional()

});

exports.EnvironmentProfileImageSchema = joi.object({

    mimetype: joi.string().valid('image/jpeg', 'image/png').required(),
    size: joi.number().max(1920 * 1080).required()
}) .unknown(true);

exports.updateEnvironmentSchema = joi.object({

    EnvironmentName: joi.string().alphanum().min(6).max(45).optional(),
    EnvironmentType_idEnvironmentType: joi.number().integer().positive().optional(),
    EnvironmentAngle: joi.string().alphanum().min(8).max(255).optional()

});
