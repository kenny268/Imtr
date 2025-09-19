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
    description: Joi.string().trim().max(1000).allow('').optional(),
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
    faculty_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    department_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    coordinator_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').default('active'),
    accreditation_body: Joi.string().trim().max(255).allow('').optional(),
    accreditation_number: Joi.string().trim().max(100).allow('').optional(),
    accreditation_date: Joi.date().iso().allow(null).optional(),
    accreditation_expiry: Joi.date().iso().allow(null).optional(),
    entry_requirements: Joi.array().items(Joi.string()).allow(null).optional(),
    learning_outcomes: Joi.array().items(Joi.string()).allow(null).optional(),
    career_prospects: Joi.array().items(Joi.string()).allow(null).optional(),
    tuition_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    registration_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    examination_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    library_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    laboratory_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    other_fees: Joi.object().allow(null).optional(),
    start_date: Joi.date().iso().allow(null).optional(),
    end_date: Joi.date().iso().allow(null).optional(),
    application_deadline: Joi.date().iso().allow(null).optional(),
    max_students: Joi.number().integer().min(1).allow(null).optional(),
    metadata: Joi.object().optional()
  }),

  update: Joi.object({
    name: Joi.string().trim().min(3).max(255).optional(),
    code: Joi.string().trim().min(2).max(20).optional(),
    description: Joi.string().trim().max(1000).allow('').optional(),
    level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc').optional(),
    duration_months: Joi.number().integer().min(1).max(120).optional(),
    total_credits: Joi.number().integer().min(1).max(200).optional(),
    min_credits_per_semester: Joi.number().integer().min(1).max(50).optional(),
    max_credits_per_semester: Joi.number().integer().min(1).max(50).optional(),
    faculty_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    department_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    coordinator_id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().pattern(/^\d+$/),
      Joi.valid(null, '')
    ).optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').optional(),
    accreditation_body: Joi.string().trim().max(255).allow('').optional(),
    accreditation_number: Joi.string().trim().max(100).allow('').optional(),
    accreditation_date: Joi.date().iso().allow(null).optional(),
    accreditation_expiry: Joi.date().iso().allow(null).optional(),
    entry_requirements: Joi.array().items(Joi.string()).allow(null).optional(),
    learning_outcomes: Joi.array().items(Joi.string()).allow(null).optional(),
    career_prospects: Joi.array().items(Joi.string()).allow(null).optional(),
    tuition_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    registration_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    examination_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    library_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    laboratory_fee: Joi.number().precision(2).min(0).allow(null).optional(),
    other_fees: Joi.object().allow(null).optional(),
    start_date: Joi.date().iso().allow(null).optional(),
    end_date: Joi.date().iso().allow(null).optional(),
    application_deadline: Joi.date().iso().allow(null).optional(),
    max_students: Joi.number().integer().min(1).allow(null).optional(),
    metadata: Joi.object().optional()
  }),

  list: Joi.object({
    ...commonSchemas.pagination,
    level: Joi.string().valid('certificate', 'diploma', 'bachelor', 'master', 'phd', 'postdoc').optional(),
    status: Joi.string().valid('active', 'inactive', 'suspended', 'archived').optional(),
    faculty_id: Joi.number().integer().positive().optional(),
    department_id: Joi.number().integer().positive().optional()
  }),

  getById: Joi.object({
    id: commonSchemas.id.required()
  })
};

module.exports = { programSchemas, commonSchemas };
