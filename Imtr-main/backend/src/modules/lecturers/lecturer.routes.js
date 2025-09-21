const express = require('express');
const router = express.Router();

const {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer
} = require('./lecturer.controller');

const { authenticateToken } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validateRequest } = require('../../middleware/validation');
const { createLecturerSchema, updateLecturerSchema } = require('./lecturer.validation');

// All routes require authentication
router.use(authenticateToken);

// Get all lecturers
router.get('/',
  requirePermission('lecturers:read'),
  getLecturers
);

// Get lecturer by ID
router.get('/:id',
  requirePermission('lecturers:read'),
  getLecturerById
);

// Create new lecturer
router.post('/',
  requirePermission('lecturers:write'),
  validateRequest(createLecturerSchema),
  createLecturer
);

// Update lecturer
router.put('/:id',
  requirePermission('lecturers:write'),
  validateRequest(updateLecturerSchema),
  updateLecturer
);

// Delete lecturer
router.delete('/:id',
  requirePermission('lecturers:delete'),
  deleteLecturer
);

module.exports = router;
