const Joi = require("joi");

// User registration validation
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// User authentication validation
const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Task creation validation
const taskValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(3).required(),
    description: Joi.string().min(5).required(),
    dueDate: Joi.date().required(),
    priority: Joi.string().valid("low", "medium", "high").required(),
  });

  return schema.validate(data);
};

module.exports = {
  registerValidation,
  loginValidation,
  taskValidation,
};
