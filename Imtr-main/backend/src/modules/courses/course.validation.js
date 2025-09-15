const Joi = require('joi');

const commonSchemas = {
  id: Joi.number().integer().positive(),
  pagination: {
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().max(255).optional(),
    sortBy: Joi.string().valid('title', 'code', 'credits', 'semester', 'year', 'status', 'created_at', 'updated_at').default('created_at'),
    sortOrder: Joi.string().valid('ASC', 'DESC').default('DESC')
  }
};

const courseSchemas = {
  create: Joi.object({
    program_id: Joi.number().integer().positive().required()
      .messages({
        'number.base': 'Program ID is required',
        'number.positive': 'Program ID must be positive'
      }),
    code: Joi.string().trim().pattern(/^[A-Z]{3}\d{3}$/).required()
      .messages({
        'string.empty': 'Course code is required',
        'string.pattern.base': 'Course code must be in format ABC123 (3 letters followed by 3 numbers)'
      }),
    title: Joi.string().trim().min(3).max(255).required()
      .messages({
        'string.empty': 'Course title is required',
        'string.min': 'Course title must be at least 3 characters',
        'string.max': 'Course title cannot exceed 255 characters'
      }),
    description: Joi.string().trim().max(1000).optional(),
    credits: Joi.number().integer().min(1).max(10).required()
      .messages({
        'number.min': 'Credits must be at least 1',
        'number.max': 'Credits cannot exceed 10'
      }),
    semester: Joi.number().integer().min(1).max(8).required()
      .messages({
        'number.min': 'Semester must be at least 1',
        'number.max': 'Semester cannot exceed 8'
      }),
    year: Joi.number().integer().min(1).max(4).required()
      .messages({
        'number.min': 'Year must be at least 1',
        'number.max': 'Year cannot exceed 4'
      }),
    course_type: Joi.string().valid('core', 'elective', 'prerequisite', 'general').default('core')
      .messages({
        'any.only': 'Course type must be one of: core, elective, prerequisite, general'
      }),
    prerequisites: Joi.array().items(Joi.number().integer().positive()).optional(),
    learning_objectives: Joi.array().items(Joi.string().trim().max(500)).optional(),
    course_content: Joi.array().items(Joi.string().trim().max(500)).optional(),
    assessment_methods: Joi.array().items(Joi.string().trim().max(200)).optional(),
    textbooks: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(255).required(),
      author: Joi.string().trim().max(255).required(),
      edition: Joi.string().trim().max(50).optional(),
      isbn: Joi.string().trim().max(20).optional(),
      publisher: Joi.string().trim().max(255).optional()
    })).optional(),
    references: Joi.array().items(Joi.string().trim().max(500)).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').default('active'),
    is_offered: Joi.boolean().default(true),
    max_students: Joi.number().integer().min(1).optional(),
    lecture_hours: Joi.number().integer().min(0).max(200).default(0),
    tutorial_hours: Joi.number().integer().min(0).max(200).default(0),
    practical_hours: Joi.number().integer().min(0).max(200).default(0),
    field_work_hours: Joi.number().integer().min(0).max(200).default(0),
    grading_system: Joi.object({
      assignments: Joi.number().min(0).max(100).default(30),
      midterm: Joi.number().min(0).max(100).default(20),
      final_exam: Joi.number().min(0).max(100).default(50),
      attendance: Joi.number().min(0).max(100).optional(),
      participation: Joi.number().min(0).max(100).optional(),
      project: Joi.number().min(0).max(100).optional()
    }).optional(),
    attendance_required: Joi.boolean().default(true),
    min_attendance_percentage: Joi.number().integer().min(0).max(100).default(75),
    metadata: Joi.object().optional()
  }),

  update: Joi.object({
    program_id: Joi.number().integer().positive().optional(),
    code: Joi.string().trim().pattern(/^[A-Z]{3}\d{3}$/).optional(),
    title: Joi.string().trim().min(3).max(255).optional(),
    description: Joi.string().trim().max(1000).optional(),
    credits: Joi.number().integer().min(1).max(10).optional(),
    semester: Joi.number().integer().min(1).max(8).optional(),
    year: Joi.number().integer().min(1).max(4).optional(),
    course_type: Joi.string().valid('core', 'elective', 'prerequisite', 'general').optional(),
    prerequisites: Joi.array().items(Joi.number().integer().positive()).optional(),
    learning_objectives: Joi.array().items(Joi.string().trim().max(500)).optional(),
    course_content: Joi.array().items(Joi.string().trim().max(500)).optional(),
    assessment_methods: Joi.array().items(Joi.string().trim().max(200)).optional(),
    textbooks: Joi.array().items(Joi.object({
      title: Joi.string().trim().max(255).required(),
      author: Joi.string().trim().max(255).required(),
      edition: Joi.string().trim().max(50).optional(),
      isbn: Joi.string().trim().max(20).optional(),
      publisher: Joi.string().trim().max(255).optional()
    })).optional(),
    references: Joi.array().items(Joi.string().trim().max(500)).optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    is_offered: Joi.boolean().optional(),
    max_students: Joi.number().integer().min(1).optional(),
    lecture_hours: Joi.number().integer().min(0).max(200).optional(),
    tutorial_hours: Joi.number().integer().min(0).max(200).optional(),
    practical_hours: Joi.number().integer().min(0).max(200).optional(),
    field_work_hours: Joi.number().integer().min(0).max(200).optional(),
    grading_system: Joi.object({
      assignments: Joi.number().min(0).max(100).optional(),
      midterm: Joi.number().min(0).max(100).optional(),
      final_exam: Joi.number().min(0).max(100).optional(),
      attendance: Joi.number().min(0).max(100).optional(),
      participation: Joi.number().min(0).max(100).optional(),
      project: Joi.number().min(0).max(100).optional()
    }).optional(),
    attendance_required: Joi.boolean().optional(),
    min_attendance_percentage: Joi.number().integer().min(0).max(100).optional(),
    metadata: Joi.object().optional()
  }),

  list: Joi.object({
    ...commonSchemas.pagination,
    program_id: Joi.number().integer().positive().optional(),
    semester: Joi.number().integer().min(1).max(8).optional(),
    year: Joi.number().integer().min(1).max(4).optional(),
    course_type: Joi.string().valid('core', 'elective', 'prerequisite', 'general').optional(),
    status: Joi.string().valid('active', 'inactive', 'archived').optional(),
    is_offered: Joi.boolean().optional()
  }),

  getById: Joi.object({
    id: commonSchemas.id.required()
  })
};

module.exports = { courseSchemas, commonSchemas };
