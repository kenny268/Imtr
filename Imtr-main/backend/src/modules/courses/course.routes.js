const express = require('express');
const router = express.Router();
const courseController = require('./course.controller');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { courseSchemas } = require('./course.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

// All routes require authentication
router.use(authenticateToken);

// Get course options (for dropdowns) - accessible by all authenticated users
router.get('/options', courseController.getCourseOptions);

// Get course statistics - admin only
router.get('/statistics',
  authorize('ADMIN'),
  courseController.getCourseStatistics
);

// Get courses by program - admin and lecturer access
router.get('/program/:programId',
  authorize(['ADMIN', 'LECTURER']),
  courseController.getCoursesByProgram
);

// Get all courses - admin and lecturer access
router.get('/',
  authorize(['ADMIN', 'LECTURER']),
  validate(courseSchemas.list, 'query'),
  courseController.getCourses
);

// Get course by ID - admin and lecturer access
router.get('/:id',
  authorize(['ADMIN', 'LECTURER']),
  validate(courseSchemas.getById, 'params'),
  courseController.getCourseById
);

// Create course - admin only
router.post('/',
  authorize('ADMIN'),
  apiLimiter,
  validate(courseSchemas.create, 'body'),
  courseController.createCourse
);

// Update course - admin only
router.put('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(courseSchemas.getById, 'params'),
  validate(courseSchemas.update, 'body'),
  courseController.updateCourse
);

// Delete course - admin only
router.delete('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(courseSchemas.getById, 'params'),
  courseController.deleteCourse
);

module.exports = router;