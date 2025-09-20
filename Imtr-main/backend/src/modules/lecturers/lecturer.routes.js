const express = require('express');
const router = express.Router();

const {
  getLecturers,
  getLecturerById
} = require('./lecturer.controller');

const { authenticateToken } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');

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

module.exports = router;
