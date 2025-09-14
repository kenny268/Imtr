const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../../middleware/auth');
const { apiLimiter } = require('../../middleware/rateLimiter');
const { validate } = require('../../middleware/validate');
const studentApprovalController = require('./student-approval.controller');
const Joi = require('joi');

// Validation schemas
const approvalSchemas = {
  approve: Joi.object({
    program_id: Joi.number().integer().positive().required(),
    enrollment_year: Joi.number().integer().min(2020).max(2030).required(),
    admission_date: Joi.date().optional(),
    scholarship_type: Joi.string().valid('none', 'merit', 'need_based', 'sports', 'research', 'government').optional(),
    scholarship_amount: Joi.number().min(0).optional()
  }),

  reject: Joi.object({
    rejection_reason: Joi.string().trim().min(10).max(500).required()
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('active', 'inactive', 'suspended', 'withdrawn', 'graduated').required(),
    reason: Joi.string().trim().max(500).optional()
  }),

  list: Joi.object({
    page: Joi.number().integer().min(1).optional(),
    limit: Joi.number().integer().min(1).max(100).optional(),
    search: Joi.string().trim().max(100).optional(),
    program_id: Joi.number().integer().positive().optional()
  })
};

// Admin routes for student approval management
router.get('/pending-registrations',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  validate(approvalSchemas.list, 'query'),
  studentApprovalController.getPendingRegistrations
);

router.post('/approve/:userId',
  authenticateToken,
  authorize(['ADMIN']),
  apiLimiter,
  validate(approvalSchemas.approve, 'body'),
  studentApprovalController.approveStudentRegistration
);

router.post('/reject/:userId',
  authenticateToken,
  authorize(['ADMIN']),
  apiLimiter,
  validate(approvalSchemas.reject, 'body'),
  studentApprovalController.rejectStudentRegistration
);

router.patch('/:studentId/status',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  apiLimiter,
  validate(approvalSchemas.updateStatus, 'body'),
  studentApprovalController.updateStudentStatus
);

router.get('/approval-stats',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  studentApprovalController.getStudentApprovalStats
);

module.exports = router;
