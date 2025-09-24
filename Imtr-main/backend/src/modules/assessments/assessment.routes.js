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
const { authenticateToken, authorize } = require('../../middleware/auth');

// Apply authentication to all routes
router.use(authenticateToken);

// Assessment CRUD operations
router.post('/', 
  authorize(['assessments:write']),
  validate(assessmentSchemas.create, 'body'),
  createAssessment
);

router.get('/', 
  authorize(['assessments:read']),
  getAssessments
);

router.get('/statistics', 
  authorize(['assessments:read']),
  getAssessmentStatistics
);

router.get('/options', 
  authorize(['assessments:read']),
  getAssessmentOptions
);

router.get('/:id', 
  authorize(['assessments:read']),
  getAssessmentById
);

router.put('/:id', 
  authorize(['assessments:write']),
  validate(assessmentSchemas.update, 'body'),
  updateAssessment
);

router.delete('/:id', 
  authorize(['assessments:delete']),
  deleteAssessment
);

// Assessment management operations
router.patch('/:id/publish', 
  authorize(['assessments:write']),
  publishAssessment
);

// Grade management
router.post('/:id/grades', 
  authorize(['assessments:write']),
  gradeAssessment
);

router.get('/:id/grades', 
  authorize(['assessments:read']),
  getStudentGrades
);

module.exports = router;
