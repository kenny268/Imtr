const express = require('express');
const router = express.Router();

const {
  createStudent,
  getStudentById,
  getStudents,
  updateStudent,
  deleteStudent,
  getStudentStatistics,
  generateStudentNumber,
  bulkUpdateStudents,
  updateAcademicProgress,
  getMyStudentProfile,
  updateMyStudentProfile,
  getStudentsByProgram,
  getStudentDashboard
} = require('./student.controller');

const { validate } = require('../../middleware/validate');
const { studentSchemas } = require('./student.validation');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { apiLimiter } = require('../../middleware/rateLimiter');

// Public routes (if any)
// None for students - all require authentication

// Protected routes for all authenticated users
router.get('/my-profile',
  authenticateToken,
  getMyStudentProfile
);

router.put('/my-profile',
  authenticateToken,
  validate(studentSchemas.update, 'body'),
  updateMyStudentProfile
);

router.get('/my-dashboard',
  authenticateToken,
  getStudentDashboard
);

// Admin and staff routes
router.post('/',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  apiLimiter,
  validate(studentSchemas.create, 'body'),
  createStudent
);

router.get('/',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER', 'FINANCE']),
  validate(studentSchemas.query, 'query'),
  getStudents
);

router.get('/statistics',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER', 'FINANCE']),
  getStudentStatistics
);

router.get('/program/:programId',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER', 'FINANCE']),
  validate(studentSchemas.query, 'query'),
  getStudentsByProgram
);

router.post('/generate-student-number',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  validate(studentSchemas.generateStudentNo, 'body'),
  generateStudentNumber
);

router.post('/bulk-update',
  authenticateToken,
  authorize(['ADMIN']),
  apiLimiter,
  validate(studentSchemas.bulkUpdate, 'body'),
  bulkUpdateStudents
);

// Individual student routes
router.get('/:id',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER', 'FINANCE']),
  validate(studentSchemas.params, 'params'),
  getStudentById
);

router.put('/:id',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  validate(studentSchemas.params, 'params'),
  validate(studentSchemas.update, 'body'),
  updateStudent
);

router.delete('/:id',
  authenticateToken,
  authorize(['ADMIN']),
  validate(studentSchemas.params, 'params'),
  deleteStudent
);

router.put('/:id/academic-progress',
  authenticateToken,
  authorize(['ADMIN', 'LECTURER']),
  validate(studentSchemas.params, 'params'),
  validate(studentSchemas.academicProgress, 'body'),
  updateAcademicProgress
);

module.exports = router;