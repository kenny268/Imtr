const express = require('express');
const router = express.Router();

const {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  getAssessmentStatistics,
  getAssessmentOptions,
  publishAssessment,
  gradeAssessment,
  getStudentGrades
} = require('./assessment.controller');

const { validate } = require('../../middleware/validate');
const { assessmentSchemas } = require('./assessment.validation');
const { authenticateToken } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');

// Apply authentication to all routes
router.use(authenticateToken);

// Assessment CRUD operations
router.post('/', 
  requirePermission('assessments:write'),
  validate(assessmentSchemas.create, 'body'),
  createAssessment
);

router.get('/', 
  requirePermission('assessments:read'),
  getAssessments
);

router.get('/statistics', 
  requirePermission('assessments:read'),
  getAssessmentStatistics
);

router.get('/options', 
  requirePermission('assessments:read'),
  getAssessmentOptions
);

router.get('/:id', 
  requirePermission('assessments:read'),
  getAssessmentById
);

router.put('/:id', 
  requirePermission('assessments:write'),
  validate(assessmentSchemas.update, 'body'),
  updateAssessment
);

router.delete('/:id', 
  requirePermission('assessments:delete'),
  deleteAssessment
);

// Assessment management operations
router.patch('/:id/publish', 
  requirePermission('assessments:write'),
  publishAssessment
);

// Grade management
router.post('/:id/grades', 
  requirePermission('assessments:write'),
  gradeAssessment
);

router.get('/:id/grades', 
  requirePermission('assessments:read'),
  getStudentGrades
);

module.exports = router;
