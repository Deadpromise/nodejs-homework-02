const Joi = require("joi");
const { emailRegexp } = require("../constants/users");
const {
  starterSubscr,
  proSubscr,
  businessSubscr,
} = require("../constants/users");

const userSubscrUpdateSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  subscription: Joi.string()
    .valid(starterSubscr, proSubscr, businessSubscr)
    .required(),
});

module.exports = userSubscrUpdateSchema;
