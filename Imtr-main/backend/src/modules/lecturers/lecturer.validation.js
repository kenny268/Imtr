const Joi = require('joi');

const createLecturerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email is required'
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'any.required': 'Password is required'
  }),
  role: Joi.string().valid('LECTURER').default('LECTURER'),
  
  profile: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).required().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters',
      'any.required': 'First name is required'
    }),
    last_name: Joi.string().trim().min(2).max(50).required().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters',
      'any.required': 'Last name is required'
    }),
    middle_name: Joi.string().trim().max(50).allow('', null).optional(),
    phone: Joi.string().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    gender: Joi.string().valid('male', 'female', 'other').allow('', null).optional(),
    date_of_birth: Joi.date().max('now').allow('', null).optional().messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    address: Joi.string().trim().max(255).allow('', null).optional(),
    city: Joi.string().trim().max(100).allow('', null).optional(),
    county: Joi.string().trim().max(100).allow('', null).optional(),
    postal_code: Joi.string().trim().max(20).allow('', null).optional(),
    national_id: Joi.string().trim().max(20).allow('', null).optional()
  }).required(),
  
  lecturer: Joi.object({
    staff_no: Joi.string().trim().pattern(/^LEC\d{4,8}$/).required().messages({
      'string.pattern.base': 'Staff number must start with LEC followed by 4-8 digits (e.g., LEC000001)',
      'any.required': 'Staff number is required'
    }),
    department_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    specialization: Joi.string().trim().min(2).max(100).required().messages({
      'string.min': 'Specialization must be at least 2 characters long',
      'string.max': 'Specialization must not exceed 100 characters',
      'any.required': 'Specialization is required'
    }),
    qualification: Joi.string().trim().max(100).allow('', null).optional(),
    highest_degree: Joi.string().valid('bachelor', 'master', 'phd', 'postdoc').allow('', null).optional(),
    institution: Joi.string().trim().max(100).allow('', null).optional(),
    year_graduated: Joi.number().integer().min(1950).max(new Date().getFullYear() + 5).allow(null).optional().messages({
      'number.min': 'Year graduated must be 1950 or later',
      'number.max': 'Year graduated cannot be more than 5 years in the future'
    }),
    employment_date: Joi.date().max('now').allow('', null).optional().messages({
      'date.max': 'Employment date cannot be in the future'
    }),
    employment_type: Joi.string().valid('full_time', 'part_time', 'contract', 'visiting').default('full_time'),
    status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
    salary_scale: Joi.string().trim().max(50).allow('', null).optional(),
    office_location: Joi.string().trim().max(100).allow('', null).optional(),
    office_phone: Joi.string().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null).optional().messages({
      'string.pattern.base': 'Please provide a valid office phone number'
    }),
    office_hours: Joi.string().trim().max(100).allow('', null).optional(),
    research_interests: Joi.string().trim().max(500).allow('', null).optional(),
    teaching_experience_years: Joi.number().integer().min(0).max(50).default(0).messages({
      'number.min': 'Teaching experience cannot be negative',
      'number.max': 'Teaching experience cannot exceed 50 years'
    }),
    industry_experience_years: Joi.number().integer().min(0).max(50).default(0).messages({
      'number.min': 'Industry experience cannot be negative',
      'number.max': 'Industry experience cannot exceed 50 years'
    }),
    is_mentor: Joi.boolean().default(false),
    max_students: Joi.number().integer().min(1).max(100).default(10).messages({
      'number.min': 'Max students must be at least 1',
      'number.max': 'Max students cannot exceed 100'
    })
  }).required()
});

const updateLecturerSchema = Joi.object({
  profile: Joi.object({
    first_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 50 characters'
    }),
    last_name: Joi.string().trim().min(2).max(50).optional().messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 50 characters'
    }),
    middle_name: Joi.string().trim().max(50).allow('', null).optional(),
    phone: Joi.string().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null).optional().messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),
    gender: Joi.string().valid('male', 'female', 'other').allow('', null).optional(),
    date_of_birth: Joi.date().max('now').allow('', null).optional().messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
    address: Joi.string().trim().max(255).allow('', null).optional(),
    city: Joi.string().trim().max(100).allow('', null).optional(),
    county: Joi.string().trim().max(100).allow('', null).optional(),
    postal_code: Joi.string().trim().max(20).allow('', null).optional(),
    national_id: Joi.string().trim().max(20).allow('', null).optional()
  }).optional(),
  
  lecturer: Joi.object({
    staff_no: Joi.string().trim().pattern(/^LEC\d{4,8}$/).optional().messages({
      'string.pattern.base': 'Staff number must start with LEC followed by 4-8 digits (e.g., LEC000001)'
    }),
    department_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    specialization: Joi.string().trim().min(2).max(100).optional().messages({
      'string.min': 'Specialization must be at least 2 characters long',
      'string.max': 'Specialization must not exceed 100 characters'
    }),
    qualification: Joi.string().trim().max(100).allow('', null).optional(),
    highest_degree: Joi.string().valid('bachelor', 'master', 'phd', 'postdoc').allow('', null).optional(),
    institution: Joi.string().trim().max(100).allow('', null).optional(),
    year_graduated: Joi.number().integer().min(1950).max(new Date().getFullYear() + 5).allow(null).optional().messages({
      'number.min': 'Year graduated must be 1950 or later',
      'number.max': 'Year graduated cannot be more than 5 years in the future'
    }),
    employment_date: Joi.date().max('now').allow('', null).optional().messages({
      'date.max': 'Employment date cannot be in the future'
    }),
    employment_type: Joi.string().valid('full_time', 'part_time', 'contract', 'visiting').optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended').optional(),
    salary_scale: Joi.string().trim().max(50).allow('', null).optional(),
    office_location: Joi.string().trim().max(100).allow('', null).optional(),
    office_phone: Joi.string().trim().pattern(/^[\+]?[0-9\s\-\(\)]+$/).allow('', null).optional().messages({
      'string.pattern.base': 'Please provide a valid office phone number'
    }),
    office_hours: Joi.string().trim().max(100).allow('', null).optional(),
    research_interests: Joi.string().trim().max(500).allow('', null).optional(),
    teaching_experience_years: Joi.number().integer().min(0).max(50).optional().messages({
      'number.min': 'Teaching experience cannot be negative',
      'number.max': 'Teaching experience cannot exceed 50 years'
    }),
    industry_experience_years: Joi.number().integer().min(0).max(50).optional().messages({
      'number.min': 'Industry experience cannot be negative',
      'number.max': 'Industry experience cannot exceed 50 years'
    }),
    is_mentor: Joi.boolean().optional(),
    max_students: Joi.number().integer().min(1).max(100).optional().messages({
      'number.min': 'Max students must be at least 1',
      'number.max': 'Max students cannot exceed 100'
    })
  }).optional()
});

const idSchema = Joi.object({
  id: Joi.number().integer().positive().required().messages({
    'number.base': 'ID must be a number',
    'number.integer': 'ID must be an integer',
    'number.positive': 'ID must be positive',
    'any.required': 'ID is required'
  })
});

module.exports = {
  createLecturerSchema,
  updateLecturerSchema,
  idSchema
};
