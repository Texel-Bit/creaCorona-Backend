const joi = require('@hapi/joi');

exports.createCompanyTypeSchema = joi.object({

    companyTypeDescription: joi.string().min(4).max(45).required()
   
});

exports.updateCompanyTypeSchema = joi.object({
 
    companyTypeDescription: joi.string().min(4).max(45).optional()

});
