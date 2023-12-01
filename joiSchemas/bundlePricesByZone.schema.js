const joi = require('@hapi/joi');

exports.updateBundlePriceByZoneSchema = joi.object({
 
    price: joi.number().positive().optional(),

});
