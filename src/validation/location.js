const Joi = require('joi');

const unLockValidation = (data) => {
  const schema = Joi.object({
    key: Joi.string().min(4).required()
  });
  return schema.validate(data);
};


module.exports.createParcelValidation = createParcelValidation;
