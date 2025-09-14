const Joi = require('joi');

const commonSchemas = require('../../middleware/validate').commonSchemas;

const studentSchemas = {
  // Create student schema
  create: Joi.object({
    user_id: Joi.number().integer().positive().required(),
    program_id: Joi.number().integer().positive().required(),
    admission_date: commonSchemas.date.required(),
    enrollment_year: Joi.number().integer().min(2020).max(2030).required(),
    expected_graduation_date: commonSchemas.date,
    scholarship_type: Joi.string().valid('none', 'merit', 'need_based', 'sports', 'research', 'government').default('none'),
    scholarship_amount: Joi.number().precision(2).min(0).default(0),
    sponsor_name: Joi.string().trim().max(255),
    sponsor_contact: Joi.string().trim().max(255),
    parent_guardian_name: Joi.string().trim().max(255),
    parent_guardian_phone: commonSchemas.phone,
    parent_guardian_email: commonSchemas.email,
    parent_guardian_relationship: Joi.string().trim().max(50),
    previous_school: Joi.string().trim().max(255),
    previous_qualification: Joi.string().trim().max(255),
    previous_gpa: Joi.number().precision(2).min(0).max(4),
    clearance_notes: Joi.string().trim()
  }),

  // Update student schema
  update: Joi.object({
    program_id: Joi.number().integer().positive(),
    status: Joi.string().valid('active', 'inactive', 'graduated', 'suspended', 'withdrawn'),
    expected_graduation_date: commonSchemas.date,
    actual_graduation_date: commonSchemas.date,
    gpa: Joi.number().precision(2).min(0).max(4),
    cgpa: Joi.number().precision(2).min(0).max(4),
    total_credits: Joi.number().integer().min(0),
    completed_credits: Joi.number().integer().min(0),
    scholarship_type: Joi.string().valid('none', 'merit', 'need_based', 'sports', 'research', 'government'),
    scholarship_amount: Joi.number().precision(2).min(0),
    sponsor_name: Joi.string().trim().max(255),
    sponsor_contact: Joi.string().trim().max(255),
    parent_guardian_name: Joi.string().trim().max(255),
    parent_guardian_phone: commonSchemas.phone,
    parent_guardian_email: commonSchemas.email,
    parent_guardian_relationship: Joi.string().trim().max(50),
    previous_school: Joi.string().trim().max(255),
    previous_qualification: Joi.string().trim().max(255),
    previous_gpa: Joi.number().precision(2).min(0).max(4),
    clearance_status: Joi.string().valid('pending', 'partial', 'complete'),
    clearance_notes: Joi.string().trim(),
    exam_card_issued: Joi.boolean(),
    exam_card_number: Joi.string().trim().max(50),
    transcript_issued: Joi.boolean(),
    transcript_number: Joi.string().trim().max(50),
    certificate_issued: Joi.boolean(),
    certificate_number: Joi.string().trim().max(50)
  }),

  // Query parameters schema
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(10),
    search: Joi.string().trim().max(255),
    program_id: Joi.number().integer().positive(),
    status: Joi.string().valid('active', 'inactive', 'graduated', 'suspended', 'withdrawn'),
    enrollment_year: Joi.number().integer().min(2020).max(2030),
    sort_by: Joi.string().valid('student_no', 'admission_date', 'created_at', 'gpa', 'cgpa').default('created_at'),
    sort_order: Joi.string().valid('ASC', 'DESC').default('DESC')
  }),

  // Student ID parameter schema
  params: Joi.object({
    id: Joi.number().integer().positive().required()
  }),

  // Generate student number schema
  generateStudentNo: Joi.object({
    program_id: Joi.number().integer().positive().required(),
    enrollment_year: Joi.number().integer().min(2020).max(2030).required()
  }),

  // Bulk operations schema
  bulkUpdate: Joi.object({
    student_ids: Joi.array().items(Joi.number().integer().positive()).min(1).max(100).required(),
    updates: Joi.object({
      status: Joi.string().valid('active', 'inactive', 'graduated', 'suspended', 'withdrawn'),
      clearance_status: Joi.string().valid('pending', 'partial', 'complete'),
      exam_card_issued: Joi.boolean(),
      transcript_issued: Joi.boolean(),
      certificate_issued: Joi.boolean()
    }).min(1).required()
  }),

  // Academic progress schema
  academicProgress: Joi.object({
    gpa: Joi.number().precision(2).min(0).max(4),
    cgpa: Joi.number().precision(2).min(0).max(4),
    completed_credits: Joi.number().integer().min(0),
    total_credits: Joi.number().integer().min(0)
  })
};

module.exports = { studentSchemas };
