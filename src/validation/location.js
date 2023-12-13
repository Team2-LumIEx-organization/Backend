const Joi = require("joi");

const unLockValidation = (data) => {
  const schema = Joi.object({
    key: Joi.string().min(4).required(),
    locationId: Joi.number().required(),
    cabinentId: Joi.number().required(),
  });
  return schema.validate(data);
};

module.exports.unLockValidation = unLockValidation;
