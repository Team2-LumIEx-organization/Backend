const Joi = require('joi');

const createParcelValidation = (data) => {
  const schema = Joi.object({
    reciver: Joi.string().min(6).required().email(),
    x: Joi.string().required(),
    y: Joi.string().required(),
    z: Joi.string().required(),
    mass: Joi.string().required(),
    name: Joi.string().min(6).required(),
    address: Joi.string().min(6).required(),
    phone_number: Joi.string().min(6).required(),
    reciver_cabinent: Joi.number().required(),
    reciver_location: Joi.string().required(),
    sender_location: Joi.string().required(),
    sender_cabinent: Joi.number().required()
  });
  return schema.validate(data);
};


module.exports.createParcelValidation = createParcelValidation;
