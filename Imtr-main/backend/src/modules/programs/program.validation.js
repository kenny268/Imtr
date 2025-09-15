const Joi = require('joi');

const commonSchemas = {
  id: Joi.number().integer().positive(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().max(255).optional(),
    sortBy: Joi.string().valid('name', 'code', 'level', 'status', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }
};

const programSchemas = {
  create: Joi.object({
    name: Joi.string().trim().min(3).max(255).required()
      .messages({
        'string.empty': 'Program name is required',
        'string.min': 'Program name must be at least 3 characters',
        'string.max': 'Program name cannot exceed 255 characters'
      }),
    code: Joi.string().trim().min(2).max(20).required()
      .messages({
        'string.empty': 'Program code is required',
        'string.min': 'Program code must be at least 2 characters',
        'string.max': 'Program code cannot exceed 20 characters'
      }),
    description: Joi.string().trim().max(1000).optional(),
    level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc').required()
      .messages({
        'any.only': 'Level must be one of: certificate, diploma, bachelor, master, phd, postdoc'
      }),
    duration_months: Joi.number().integer().min(1).max(120).required()
      .messages({
        'number.min': 'Duration must be at least 1 month',
        'number.max': 'Duration cannot exceed 120 months'
      }),
    total_credits: Joi.number().integer().min(1).max(200).required()
      .messages({
        'number.min': 'Total credits must be at least 1',
        'number.max': 'Total credits cannot exceed 200'
      }),
    min_credits_per_semester: Joi.number().integer().min(1).max(50).default(12),
    max_credits_per_semester: Joi.number().integer().min(1).max(50).default(18),
    department: Joi.string().trim().max(100).optional(),
    faculty: Joi.string().trim().max(100).optional(),
    coordinator_id: Joi.number().integer().positive().optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').default('active'),
    accreditation_body: Joi.string().trim().max(255).optional(),
    accreditation_number: Joi.string().trim().max(100).optional(),
    accreditation_date: Joi.date().iso().optional(),
    accreditation_expiry: Joi.date().iso().optional(),
    entry_requirements: Joi.object().optional(),
    learning_outcomes: Joi.array().items(Joi.string()).optional(),
    career_prospects: Joi.array().items(Joi.string()).optional(),
    tuition_fee: Joi.number().precision(2).min(0).optional(),
    registration_fee: Joi.number().precision(2).min(0).optional(),
    examination_fee: Joi.number().precision(2).min(0).optional(),
    library_fee: Joi.number().precision(2).min(0).optional(),
    laboratory_fee: Joi.number().precision(2).min(0).optional(),
    other_fees: Joi.object().optional(),
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().optional(),
    application_deadline: Joi.date().iso().optional(),
    max_students: Joi.number().integer().min(1).optional(),
    metadata: Joi.object().optional()
  }),

  update: Joi.object({
    name: Joi.string().trim().min(3).max(255).optional(),
    code: Joi.string().trim().min(2).max(20).optional(),
    description: Joi.string().trim().max(1000).optional(),
    level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc').optional(),
    duration_months: Joi.number().integer().min(1).max(120).optional(),
    total_credits: Joi.number().integer().min(1).max(200).optional(),
    min_credits_per_semester: Joi.number().integer().min(1).max(50).optional(),
    max_credits_per_semester: Joi.number().integer().min(1).max(50).optional(),
    department: Joi.string().trim().max(100).optional(),
    faculty: Joi.string().trim().max(100).optional(),
    coordinator_id: Joi.number().integer().positive().optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').optional(),
    accreditation_body: Joi.string().trim().max(255).optional(),
    accreditation_number: Joi.string().trim().max(100).optional(),
    accreditation_date: Joi.date().iso().optional(),
    accreditation_expiry: Joi.date().iso().optional(),
    entry_requirements: Joi.object().optional(),
    learning_outcomes: Joi.array().items(Joi.string()).optional(),
    career_prospects: Joi.array().items(Joi.string()).optional(),
    tuition_fee: Joi.number().precision(2).min(0).optional(),
    registration_fee: Joi.number().precision(2).min(0).optional(),
    examination_fee: Joi.number().precision(2).min(0).optional(),
    library_fee: Joi.number().precision(2).min(0).optional(),
    laboratory_fee: Joi.number().precision(2).min(0).optional(),
    other_fees: Joi.object().optional(),
    start_date: Joi.date().iso().optional(),
    end_date: Joi.date().iso().optional(),
    application_deadline: Joi.date().iso().optional(),
    max_students: Joi.number().integer().min(1).optional(),
    metadata: Joi.object().optional()
  }),

  list: Joi.object({
    ...commonSchemas.pagination,
    level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc').optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').optional(),
    department: Joi.string().trim().max(100).optional(),
    faculty: Joi.string().trim().max(100).optional()
  }),

  getById: Joi.object({
    id: commonSchemas.id.required()
  })
};

module.exports = { programSchemas, commonSchemas };
