const Joi = require('joi');
const { logger } = require('../config/logger');

// Generic validation middleware
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation error:', {
        requestId: req.requestId,
        errors: errorDetails,
        body: req.body,
        params: req.params,
        query: req.query
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorDetails
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common validation schemas
const commonSchemas = {
  // Pagination
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    sort: Joi.string().valid('asc', 'desc').default('desc'),
    sortBy: Joi.string().default('created_at')
  }),

  // Search
  search: Joi.object({
    search: Joi.string().trim().max(255).allow(''),
    filters: Joi.object().pattern(
      Joi.string(),
      Joi.alternatives().try(
        Joi.string(),
        Joi.number(),
        Joi.boolean(),
        Joi.array()
      )
    )
  }),

  // ID parameter
  id: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  // Email
  email: Joi.string().email().trim().lowercase().required(),

  // Password
  password: Joi.string()
    .min(8)
    .max(128)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character'
    }),

  // Phone number (Kenya format)
  phone: Joi.string()
    .pattern(/^(\+254|0)[17]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must be a valid Kenya mobile number'
    }),

  // Date
  date: Joi.date().iso().required(),

  // Gender
  gender: Joi.string().valid('male', 'female', 'other').required(),

  // User roles
  role: Joi.string().valid('ADMIN', 'LECTURER', 'STUDENT', 'FINANCE', 'LIBRARIAN', 'IT').required(),

  // User status
  status: Joi.string().valid('active', 'inactive', 'suspended', 'pending').default('active'),

  // Currency amount (KES)
  amount: Joi.number().positive().precision(2).required(),

  // File upload
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().required(),
    size: Joi.number().positive().required()
  })
};

// Auth validation schemas
const authSchemas = {
  login: Joi.object({
    email: commonSchemas.email,
    password: Joi.string().required()
  }),

  register: Joi.object({
    email: commonSchemas.email,
    password: commonSchemas.password,
    role: commonSchemas.role,
    profile: Joi.object({
      firstName: Joi.string().trim().min(2).max(50).required(),
      lastName: Joi.string().trim().min(2).max(50).required(),
      phone: commonSchemas.phone,
      gender: commonSchemas.gender,
      dateOfBirth: commonSchemas.date,
      address: Joi.string().trim().max(255),
      nationalId: Joi.string().trim().pattern(/^\d{8}$/).messages({
        'string.pattern.base': 'National ID must be 8 digits'
      })
    }).required()
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: commonSchemas.password
  }),

  resetPassword: Joi.object({
    token: Joi.string().required(),
    newPassword: commonSchemas.password
  }),

  forgotPassword: Joi.object({
    email: commonSchemas.email
  }),

  verifyEmail: Joi.object({
    token: Joi.string().required()
  }),

  resendVerification: Joi.object({
    email: commonSchemas.email
  }),

  updateProfile: Joi.object({
    email: commonSchemas.email.optional(),
    profile: Joi.object({
      firstName: Joi.string().trim().min(2).max(50).optional(),
      lastName: Joi.string().trim().min(2).max(50).optional(),
      middleName: Joi.string().trim().min(2).max(50).optional(),
      phone: commonSchemas.phone.optional(),
      gender: commonSchemas.gender.optional(),
      dateOfBirth: commonSchemas.date.optional(),
      address: Joi.string().trim().max(255).optional(),
      city: Joi.string().trim().max(100).optional(),
      county: Joi.string().trim().max(100).optional(),
      postalCode: Joi.string().trim().max(20).optional(),
      nationalId: Joi.string().trim().pattern(/^\d{8}$/).optional(),
      passportNumber: Joi.string().trim().max(50).optional(),
      emergencyContactName: Joi.string().trim().max(100).optional(),
      emergencyContactPhone: Joi.string().trim().max(20).optional(),
      emergencyContactRelationship: Joi.string().trim().max(50).optional(),
      bio: Joi.string().trim().max(500).optional(),
      website: Joi.string().uri().optional(),
      linkedin: Joi.string().uri().optional(),
      twitter: Joi.string().uri().optional()
    }).optional()
  })
};

// User validation schemas
const userSchemas = {
  create: authSchemas.register,
  
  update: Joi.object({
    email: commonSchemas.email.optional(),
    status: commonSchemas.status.optional(),
    profile: Joi.object({
      firstName: Joi.string().trim().min(2).max(50).optional(),
      lastName: Joi.string().trim().min(2).max(50).optional(),
      phone: commonSchemas.phone.optional(),
      gender: commonSchemas.gender.optional(),
      dateOfBirth: commonSchemas.date.optional(),
      address: Joi.string().trim().max(255).optional(),
      nationalId: Joi.string().trim().pattern(/^\d{8}$/).optional()
    }).optional()
  }),

  list: Joi.object({
    ...commonSchemas.pagination.describe(),
    ...commonSchemas.search.describe(),
    role: commonSchemas.role.optional(),
    status: commonSchemas.status.optional()
  })
};

// Student validation schemas
const studentSchemas = {
  create: Joi.object({
    userId: Joi.number().integer().positive().required(),
    studentNo: Joi.string().trim().pattern(/^STU\d{6}$/).required().messages({
      'string.pattern.base': 'Student number must be in format STU######'
    }),
    admissionDate: commonSchemas.date,
    programId: Joi.number().integer().positive().required(),
    status: commonSchemas.status
  }),

  update: Joi.object({
    studentNo: Joi.string().trim().pattern(/^STU\d{6}$/).optional(),
    admissionDate: commonSchemas.date.optional(),
    programId: Joi.number().integer().positive().optional(),
    status: commonSchemas.status.optional()
  }),

  list: Joi.object({
    ...commonSchemas.pagination.describe(),
    ...commonSchemas.search.describe(),
    programId: Joi.number().integer().positive().optional(),
    status: commonSchemas.status.optional()
  })
};

// Course validation schemas
const courseSchemas = {
  create: Joi.object({
    programId: Joi.number().integer().positive().required(),
    code: Joi.string().trim().pattern(/^[A-Z]{3}\d{3}$/).required().messages({
      'string.pattern.base': 'Course code must be in format ABC123'
    }),
    title: Joi.string().trim().min(3).max(100).required(),
    credits: Joi.number().integer().min(1).max(10).required(),
    semester: Joi.number().integer().min(1).max(8).required(),
    description: Joi.string().trim().max(500).optional()
  }),

  update: Joi.object({
    code: Joi.string().trim().pattern(/^[A-Z]{3}\d{3}$/).optional(),
    title: Joi.string().trim().min(3).max(100).optional(),
    credits: Joi.number().integer().min(1).max(10).optional(),
    semester: Joi.number().integer().min(1).max(8).optional(),
    description: Joi.string().trim().max(500).optional()
  })
};

// Finance validation schemas
const financeSchemas = {
  createInvoice: Joi.object({
    studentId: Joi.number().integer().positive().required(),
    items: Joi.array().items(
      Joi.object({
        item: Joi.string().trim().min(3).max(100).required(),
        amount: commonSchemas.amount
      })
    ).min(1).required(),
    dueDate: commonSchemas.date
  }),

  createPayment: Joi.object({
    invoiceId: Joi.number().integer().positive().required(),
    amount: commonSchemas.amount,
    method: Joi.string().valid('mpesa', 'card', 'bank_transfer', 'cash').required(),
    reference: Joi.string().trim().max(100).optional()
  }),

  mpesaStk: Joi.object({
    invoiceId: Joi.number().integer().positive().required(),
    phoneNumber: commonSchemas.phone
  })
};

module.exports = {
  validate,
  commonSchemas,
  authSchemas,
  userSchemas,
  studentSchemas,
  courseSchemas,
  financeSchemas
};
