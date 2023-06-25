const Joi = require("joi");

const { emailRegexp } = require("../constants/users");

const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

module.exports = userEmailSchema;
