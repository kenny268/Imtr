const Joi = require('joi');

const createInvoiceSchema = Joi.object({
  student_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Student ID must be a number',
      'number.integer': 'Student ID must be an integer',
      'number.positive': 'Student ID must be positive',
      'any.required': 'Student ID is required'
    }),
  items: Joi.array().items(
    Joi.object({
      item: Joi.string().min(1).max(255).required()
        .messages({
          'string.empty': 'Item name cannot be empty',
          'string.min': 'Item name must be at least 1 character',
          'string.max': 'Item name cannot exceed 255 characters',
          'any.required': 'Item name is required'
        }),
      amount_kes: Joi.number().positive().precision(2).required()
        .messages({
          'number.base': 'Amount must be a number',
          'number.positive': 'Amount must be positive',
          'any.required': 'Amount is required'
        }),
      description: Joi.string().max(500).optional()
        .messages({
          'string.max': 'Description cannot exceed 500 characters'
        })
    })
  ).min(1).required()
    .messages({
      'array.min': 'At least one item is required',
      'any.required': 'Items are required'
    }),
  due_date: Joi.date().iso().required()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be in ISO format',
      'any.required': 'Due date is required'
    }),
  notes: Joi.string().max(1000).optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

const updateInvoiceSchema = Joi.object({
  status: Joi.string().valid('pending', 'paid', 'overdue', 'cancelled').optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: pending, paid, overdue, cancelled'
    }),
  due_date: Joi.date().iso().optional()
    .messages({
      'date.base': 'Due date must be a valid date',
      'date.format': 'Due date must be in ISO format'
    }),
  notes: Joi.string().max(1000).optional()
    .messages({
      'string.max': 'Notes cannot exceed 1000 characters'
    })
});

const createPaymentSchema = Joi.object({
  invoice_id: Joi.number().integer().positive().required()
    .messages({
      'number.base': 'Invoice ID must be a number',
      'number.integer': 'Invoice ID must be an integer',
      'number.positive': 'Invoice ID must be positive',
      'any.required': 'Invoice ID is required'
    }),
  amount_kes: Joi.number().positive().precision(2).required()
    .messages({
      'number.base': 'Amount must be a number',
      'number.positive': 'Amount must be positive',
      'any.required': 'Amount is required'
    }),
  method: Joi.string().valid('mpesa', 'card', 'bank_transfer', 'cash').required()
    .messages({
      'string.base': 'Payment method must be a string',
      'any.only': 'Payment method must be one of: mpesa, card, bank_transfer, cash',
      'any.required': 'Payment method is required'
    }),
  mpesa_ref: Joi.string().max(100).optional()
    .messages({
      'string.max': 'M-Pesa reference cannot exceed 100 characters'
    }),
  transaction_id: Joi.string().max(100).optional()
    .messages({
      'string.max': 'Transaction ID cannot exceed 100 characters'
    }),
  paid_at: Joi.date().iso().required()
    .messages({
      'date.base': 'Paid date must be a valid date',
      'date.format': 'Paid date must be in ISO format',
      'any.required': 'Paid date is required'
    }),
  notes: Joi.string().max(500).optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

const getInvoicesSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  status: Joi.string().valid('pending', 'paid', 'overdue', 'cancelled').optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: pending, paid, overdue, cancelled'
    }),
  student_id: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Student ID must be a number',
      'number.integer': 'Student ID must be an integer',
      'number.positive': 'Student ID must be positive'
    }),
  search: Joi.string().max(100).optional()
    .messages({
      'string.max': 'Search term cannot exceed 100 characters'
    })
});

const getPaymentsSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),
  limit: Joi.number().integer().min(1).max(100).default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100'
    }),
  status: Joi.string().valid('pending', 'completed', 'failed', 'cancelled').optional()
    .messages({
      'string.base': 'Status must be a string',
      'any.only': 'Status must be one of: pending, completed, failed, cancelled'
    }),
  method: Joi.string().valid('mpesa', 'card', 'bank_transfer', 'cash').optional()
    .messages({
      'string.base': 'Method must be a string',
      'any.only': 'Method must be one of: mpesa, card, bank_transfer, cash'
    }),
  search: Joi.string().max(100).optional()
    .messages({
      'string.max': 'Search term cannot exceed 100 characters'
    })
});

const getFeeStructuresSchema = Joi.object({
  program_id: Joi.number().integer().positive().optional()
    .messages({
      'number.base': 'Program ID must be a number',
      'number.integer': 'Program ID must be an integer',
      'number.positive': 'Program ID must be positive'
    })
});

module.exports = {
  createInvoiceSchema,
  updateInvoiceSchema,
  createPaymentSchema,
  getInvoicesSchema,
  getPaymentsSchema,
  getFeeStructuresSchema
};
