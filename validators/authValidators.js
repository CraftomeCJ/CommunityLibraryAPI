const Joi = require('joi');

// Schema for user registration
const registerSchema = Joi.object({
  username: Joi.string().trim().min(3).max(50).required().messages({
    'string.empty': 'Username is required',
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be at most 50 characters',
    'any.required': 'Username is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.empty': 'Password is required',
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('member', 'librarian').required().messages({
    'any.only': 'Role must be member or librarian',
    'any.required': 'Role is required'
  })
});

// Schema for user login
const loginSchema = Joi.object({
  username: Joi.string().trim().required().messages({
    'string.empty': 'Username is required',
    'any.required': 'Username is required'
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
    'any.required': 'Password is required'
  })
});

// Schema for updating user role
const updateUserRoleSchema = Joi.object({
  role: Joi.string().valid('member', 'librarian').required().messages({
    'any.only': 'Role must be member or librarian',
    'any.required': 'Role is required'
  })
});

// Schema for user ID param
const userIdParamSchema = Joi.object({
  userId: Joi.number().integer().positive().required().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive',
    'any.required': 'User ID is required'
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserRoleSchema,
  userIdParamSchema
};