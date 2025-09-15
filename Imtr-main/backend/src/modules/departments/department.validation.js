const Joi = require('joi');

const commonSchemas = {
  id: Joi.number().integer().positive(),
  name: Joi.string().trim().min(2).max(100).required(),
  code: Joi.string().trim().min(2).max(10).uppercase().required(),
  description: Joi.string().trim().max(1000).allow(''),
  status: Joi.string().valid('active', 'inactive', 'suspended').default('active'),
  email: Joi.string().email().max(100),
  phone: Joi.string().pattern(/^[\+]?[0-9\s\-\(\)]{10,20}$/).messages({
    'string.pattern.base': 'Phone number must be valid'
  }),
  website: Joi.string().uri().max(255),
  date: Joi.date().iso()
};

const departmentSchemas = {
  create: Joi.object({
    faculty_id: Joi.number().integer().positive().required(),
    name: commonSchemas.name,
    code: commonSchemas.code,
    description: commonSchemas.description,
    head_name: Joi.string().trim().min(2).max(100).allow(''),
    head_email: commonSchemas.email.allow(''),
    head_phone: commonSchemas.phone.allow(''),
    location: Joi.string().trim().max(100).allow(''),
    room: Joi.string().trim().max(50).allow(''),
    status: commonSchemas.status,
    established_date: commonSchemas.date.allow(''),
    website: commonSchemas.website.allow(''),
    metadata: Joi.object().default({})
  }),

  update: Joi.object({
    faculty_id: Joi.number().integer().positive().optional(),
    name: commonSchemas.name.optional(),
    code: commonSchemas.code.optional(),
    description: commonSchemas.description.optional(),
    head_name: Joi.string().trim().min(2).max(100).allow('').optional(),
    head_email: commonSchemas.email.allow('').optional(),
    head_phone: commonSchemas.phone.allow('').optional(),
    location: Joi.string().trim().max(100).allow('').optional(),
    room: Joi.string().trim().max(50).allow('').optional(),
    status: commonSchemas.status.optional(),
    established_date: commonSchemas.date.allow('').optional(),
    website: commonSchemas.website.allow('').optional(),
    metadata: Joi.object().optional()
  }).min(1),

  list: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    search: Joi.string().trim().max(100).allow(''),
    faculty_id: Joi.number().integer().positive().allow(''),
    status: Joi.string().valid('active', 'inactive', 'suspended').allow(''),
    sortBy: Joi.string().valid('name', 'code', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  getById: Joi.object({
    id: commonSchemas.id.required()
  }),

  getByFaculty: Joi.object({
    faculty_id: Joi.number().integer().positive().required()
  })
};

module.exports = { departmentSchemas };
