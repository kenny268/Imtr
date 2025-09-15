const express = require('express');
const router = express.Router();
const programController = require('./program.controller');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { validate } = require('../../middleware/validate');
const { programSchemas } = require('./program.validation');
const { apiLimiter } = require('../../middleware/rateLimiter');

// All routes require authentication
router.use(authenticateToken);

// Get program options (for dropdowns) - accessible by all authenticated users
router.get('/options', programController.getProgramOptions);

// Get program statistics - admin only
router.get('/statistics',
  authorize('ADMIN'),
  programController.getProgramStatistics
);

// Get all programs - admin and lecturer access
router.get('/',
  authorize(['ADMIN', 'LECTURER']),
  validate(programSchemas.list, 'query'),
  programController.getPrograms
);

// Get program by ID - admin and lecturer access
router.get('/:id',
  authorize(['ADMIN', 'LECTURER']),
  validate(programSchemas.getById, 'params'),
  programController.getProgramById
);

// Create program - admin only
router.post('/',
  authorize('ADMIN'),
  apiLimiter,
  validate(programSchemas.create, 'body'),
  programController.createProgram
);

// Update program - admin only
router.put('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(programSchemas.getById, 'params'),
  validate(programSchemas.update, 'body'),
  programController.updateProgram
);

// Delete program - admin only
router.delete('/:id',
  authorize('ADMIN'),
  apiLimiter,
  validate(programSchemas.getById, 'params'),
  programController.deleteProgram
);

module.exports = router;
