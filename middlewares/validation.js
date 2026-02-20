const Joi = require('joi');

// Middleware to validate request data using Joi schema
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ message: errors[0] }); // Return first error message
  }
  next();
};

// Validate params (e.g., IDs)
const validateParams = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => detail.message);
    return res.status(400).json({ message: 'Validation error', errors });
  }
  next();
};

module.exports = { validate, validateParams };