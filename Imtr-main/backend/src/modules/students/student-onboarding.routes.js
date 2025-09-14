const express = require('express');
const router = express.Router();
const { authenticateToken, authorize } = require('../../middleware/auth');
const { apiLimiter } = require('../../middleware/rateLimiter');
const { validate } = require('../../middleware/validate');
const studentOnboardingController = require('./student-onboarding.controller');
const Joi = require('joi');

// Validation schemas
const profileCompletionSchema = Joi.object({
  first_name: Joi.string().trim().min(2).max(50).optional(),
  last_name: Joi.string().trim().min(2).max(50).optional(),
  phone: Joi.string().trim().pattern(/^(\+254|0)[17]\d{8}$/).optional(),
  gender: Joi.string().valid('male', 'female', 'other').optional(),
  date_of_birth: Joi.date().max('now').optional(),
  address: Joi.string().trim().max(255).optional(),
  national_id: Joi.string().trim().pattern(/^\d{8}$/).optional(),
  profile_photo: Joi.string().uri().optional(),
  emergency_contact_name: Joi.string().trim().max(100).optional(),
  emergency_contact_phone: Joi.string().trim().pattern(/^(\+254|0)[17]\d{8}$/).optional(),
  emergency_contact_relationship: Joi.string().trim().max(50).optional(),
  bio: Joi.string().trim().max(500).optional(),
  linkedin: Joi.string().uri().optional(),
  twitter: Joi.string().uri().optional()
});

// Student onboarding routes
router.get('/status',
  authenticateToken,
  authorize(['STUDENT']),
  studentOnboardingController.getOnboardingStatus
);

router.put('/complete-profile',
  authenticateToken,
  authorize(['STUDENT']),
  apiLimiter,
  validate(profileCompletionSchema, 'body'),
  studentOnboardingController.completeProfile
);

router.get('/dashboard',
  authenticateToken,
  authorize(['STUDENT']),
  studentOnboardingController.getStudentDashboard
);

router.get('/checklist',
  authenticateToken,
  authorize(['STUDENT']),
  studentOnboardingController.getOnboardingChecklist
);

module.exports = router;
