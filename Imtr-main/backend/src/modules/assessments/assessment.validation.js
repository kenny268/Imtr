const Joi = require('joi');

const assessmentSchemas = {
  create: Joi.object({
    class_section_id: Joi.number().integer().positive().required(),
    lecturer_id: Joi.number().integer().positive().required(),
    title: Joi.string().min(3).max(255).required(),
    type: Joi.string().valid('assignment', 'quiz', 'midterm', 'final', 'project', 'presentation', 'lab').required(),
    max_score: Joi.number().positive().precision(2).required(),
    weight: Joi.number().min(0).max(100).precision(2).required(),
    due_date: Joi.date().iso().allow(null).optional(),
    instructions: Joi.string().max(5000).allow('').optional(),
    status: Joi.string().valid('draft', 'published', 'grading', 'completed').optional()
  }),

  update: Joi.object({
    title: Joi.string().min(3).max(255).optional(),
    type: Joi.string().valid('assignment', 'quiz', 'midterm', 'final', 'project', 'presentation', 'lab').optional(),
    max_score: Joi.number().positive().precision(2).optional(),
    weight: Joi.number().min(0).max(100).precision(2).optional(),
    due_date: Joi.date().iso().allow(null).optional(),
    instructions: Joi.string().max(5000).allow('').optional(),
    status: Joi.string().valid('draft', 'published', 'grading', 'completed').optional()
  }),

  grade: Joi.object({
    student_id: Joi.number().integer().positive().required(),
    score: Joi.number().min(0).precision(2).required(),
    letter_grade: Joi.string().max(5).optional(),
    comments: Joi.string().max(1000).allow('').optional()
  }),

  publish: Joi.object({
    due_date: Joi.date().iso().optional(),
    instructions: Joi.string().max(5000).allow('').optional()
  })
};

module.exports = { assessmentSchemas };
