const Joi = require('@hapi/joi');

function validateSchema(bodySchema, fileSchema = Joi.any().optional()) {
  return (req, res, next) => {
    // Validate body
    const { error: bodyError } = bodySchema.validate(req.body);
    if (bodyError) {
      const err = new Error(bodyError.details[0].message);
      err.status = 400;
      return next(err);
    }

    // Validate file, if it exists in the request
    if (req.file) {
      const { error: fileError } = fileSchema.validate(req.file);
      if (fileError) {
        const err = new Error(fileError.details[0].message);
        err.status = 400;
        return next(err);
      }
    }

    next();
  };
}


  
  module.exports = validateSchema;