const Joi = require('joi');

// Schema for creating a book
const createBookSchema = Joi.object({
  title: Joi.string().trim().required().messages({
    'string.empty': 'Title is required',
    'any.required': 'Title is required'
  }),
  author: Joi.string().trim().required().messages({
    'string.empty': 'Author is required',
    'any.required': 'Author is required'
  }),
  availability: Joi.string().valid('Y', 'N').required().messages({
    'any.only': 'Availability must be Y or N',
    'any.required': 'Availability is required'
  })
});

// Schema for updating a book
const updateBookSchema = Joi.object({
  title: Joi.string().trim().optional(),
  author: Joi.string().trim().optional(),
  availability: Joi.string().valid('Y', 'N').optional().messages({
    'any.only': 'Availability must be Y or N'
  })
}).min(1).messages({
  'object.min': 'At least one field must be provided for update'
});

// Schema for updating book availability
const updateAvailabilitySchema = Joi.object({
  availability: Joi.string().valid('Y', 'N').required().messages({
    'any.only': 'Availability must be Y or N',
    'any.required': 'Availability is required'
  })
});

// Schema for book ID param
const bookIdParamSchema = Joi.object({
  bookId: Joi.number().integer().positive().required().messages({
    'number.base': 'Book ID must be a number',
    'number.integer': 'Book ID must be an integer',
    'number.positive': 'Book ID must be positive',
    'any.required': 'Book ID is required'
  })
});

module.exports = {
  createBookSchema,
  updateBookSchema,
  updateAvailabilitySchema,
  bookIdParamSchema
};