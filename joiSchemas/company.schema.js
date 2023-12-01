const joi = require('@hapi/joi');

exports.createCompanySchema = joi.object({

    CompanyName: joi.string().alphanum().min(4).max(45).required(),
    CompanyAddress: joi.string().alphanum().min(4).max(80).required(),
    CompanyEmail: joi.string().alphanum().min(4).max(255).required(),
    CompanyContactName: joi.string().alphanum().min(4).max(255).required(),
    CompanyCode: joi.string().alphanum().min(4).max(45).required(),
    CompanyNIT: joi.string().alphanum().min(4).max(45).required(),
    CompanyPhone: joi.string().alphanum().min(4).max(45).required(),
    companyStatus_idcompanyStatus: joi.number().integer().positive().required(),
    CompanyRole_idCompanyRole: joi.number().integer().positive().required(),
    companyType_idcompanyType: joi.number().integer().positive().required(),
   
});

exports.updateCompanySchema = joi.object({
 
    CompanyName: joi.string().regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚüÜ !@#$%^&*()_+[\]{}|:;"'<>,.?/\\-]*$/u).min(6).max(45).optional(),
    CompanyAddress: joi.string().alphanum().min(4).max(80).optional(),
    CompanyEmail: joi.string().email().min(4).max(255).optional(),
    CompanyContactName: joi.string().alphanum().min(4).max(255).optional(),
    CompanyCode: joi.string().alphanum().min(4).max(45).optional(),
    CompanyNIT: joi.string().alphanum().min(4).max(45).optional(),
    CompanyPhone: joi.string().alphanum().min(4).max(45).optional(),
    companyStatus_idcompanyStatus: joi.number().integer().positive().optional(),
    CompanyRole_idCompanyRole: joi.number().integer().positive().optional(),
    companyType_idcompanyType: joi.number().integer().positive().optional(),

});
