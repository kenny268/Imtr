const express = require('express');
const router = express.Router();
const departmentController = require('./department.controller');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { departmentSchemas } = require('./department.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

// All routes require authentication
router.use(authenticateToken);

// Get department options (for dropdowns) - accessible by all authenticated users
router.get('/options', departmentController.getDepartmentOptions);

// Get departments by faculty - accessible by all authenticated users
router.get('/faculty/:facultyId',
  validate(departmentSchemas.getByFaculty, 'params'),
  departmentController.getDepartmentsByFaculty
);

// Get department statistics - admin only
router.get('/statistics',
  authorize('ADMIN'),
  departmentController.getDepartmentStatistics
);

// Get all departments - admin and lecturer access
router.get('/',
  authorize(['ADMIN', 'LECTURER']),
  validate(departmentSchemas.list, 'query'),
  departmentController.getDepartments
);

// Get department by ID - admin and lecturer access
router.get('/:id',
  authorize(['ADMIN', 'LECTURER']),
  validate(departmentSchemas.getById, 'params'),
  departmentController.getDepartmentById
);

// Create department - admin only
router.post('/',
  authorize('ADMIN'),
  apiLimiter,
  validate(departmentSchemas.create, 'body'),
  departmentController.createDepartment
);

// Update department - admin only
router.put('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(departmentSchemas.getById, 'params'),
  validate(departmentSchemas.update, 'body'),
  departmentController.updateDepartment
);

// Delete department - admin only
router.delete('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(departmentSchemas.getById, 'params'),
  departmentController.deleteDepartment
);

module.exports = router;
