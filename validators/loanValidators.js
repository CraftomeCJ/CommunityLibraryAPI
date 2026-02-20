const Joi = require('joi');

// Schema for creating a loan
const createLoanSchema = Joi.object({
  bookId: Joi.number().integer().positive().required().messages({
    'number.base': 'Book ID must be a number',
    'number.integer': 'Book ID must be an integer',
    'number.positive': 'Book ID must be positive',
    'any.required': 'Book ID is required'
  }),
  userId: Joi.number().integer().positive().optional().messages({
    'number.base': 'User ID must be a number',
    'number.integer': 'User ID must be an integer',
    'number.positive': 'User ID must be positive'
  }),
  dueDate: Joi.date().iso().required().messages({
    'date.format': 'Due date must be in ISO format (YYYY-MM-DD)',
    'any.required': 'Due date is required'
  })
});

// Schema for loan ID param
const loanIdParamSchema = Joi.object({
  loanId: Joi.number().integer().positive().required().messages({
    'number.base': 'Loan ID must be a number',
    'number.integer': 'Loan ID must be an integer',
    'number.positive': 'Loan ID must be positive',
    'any.required': 'Loan ID is required'
  })
});

module.exports = {
  createLoanSchema,
  loanIdParamSchema
};