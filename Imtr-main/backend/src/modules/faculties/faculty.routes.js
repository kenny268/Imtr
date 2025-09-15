const express = require('express');
const router = express.Router();
const facultyController = require('./faculty.controller');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { facultySchemas } = require('./faculty.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

// All routes require authentication
router.use(authenticateToken);

// Get faculty options (for dropdowns) - accessible by all authenticated users
router.get('/options', facultyController.getFacultyOptions);

// Get faculty statistics - admin only
router.get('/statistics',
  authorize('ADMIN'),
  facultyController.getFacultyStatistics
);

// Get all faculties - admin and lecturer access
router.get('/',
  authorize(['ADMIN', 'LECTURER']),
  validate(facultySchemas.list, 'query'),
  facultyController.getFaculties
);

// Get faculty by ID - admin and lecturer access
router.get('/:id',
  authorize(['ADMIN', 'LECTURER']),
  validate(facultySchemas.getById, 'params'),
  facultyController.getFacultyById
);

// Create faculty - admin only
router.post('/',
  authorize('ADMIN'),
  apiLimiter,
  validate(facultySchemas.create, 'body'),
  facultyController.createFaculty
);

// Update faculty - admin only
router.put('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(facultySchemas.getById, 'params'),
  validate(facultySchemas.update, 'body'),
  facultyController.updateFaculty
);

// Delete faculty - admin only
router.delete('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(facultySchemas.getById, 'params'),
  facultyController.deleteFaculty
);

module.exports = router;
