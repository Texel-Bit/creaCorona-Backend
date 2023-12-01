const joi = require('@hapi/joi');

exports.registerSchema = joi.object({

    email: joi.string().email().min(6).max(64).required(),
    lastName: joi.string().min(3).max(12).required(),
    phone: joi.string().min(6).max(64).required(),
    userName: joi.string().min(3).max(12).required(),
    office_idoffice: joi.number().integer().positive().required(),
    password: joi.string().alphanum().min(8).max(12).required()


});

exports.loginSchema = joi.object({

    email: joi.string().email().min(6).max(64).required(),
    password: joi.string().alphanum().min(8).max(12).required()

});

exports.updateSysUser = joi.object({

    userName: joi.string().min(3).optional(),
    lastName: joi.string().min(3).optional(),
    email: joi.string().email().min(6).max(64).optional(),
    phone: joi.string().min(6).max(64).optional(),
    userRole_iduserRole: joi.number().integer().positive().optional(),
    userStatus_iduserStatus: joi.number().integer().positive().optional(),
    office_idoffice: joi.number().integer().positive().optional()

})
  