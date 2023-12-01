const joi = require('@hapi/joi');

exports.createCompanyZoneSchema = joi.object({

    companyZoneName: joi.string().regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ !@#$%^&*()_+[\]{}|:;"'<>,.?/\\-]*$/u).min(6).max(45).required(),
   
});

exports.updateCompanyZoneSchema = joi.object({
 
    companyZoneName: joi.string().regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ !@#$%^&*()_+[\]{}|:;"'<>,.?/\\-]*$/u).min(6).max(45).optional(),

});
