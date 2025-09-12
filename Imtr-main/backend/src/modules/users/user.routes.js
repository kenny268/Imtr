const express = require('express');
const router = express.Router();

const {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('./user.controller');

const { authenticateToken } = require('../../middleware/auth');
const { requirePermission } = require('../../middleware/rbac');
const { validate } = require('../../middleware/validate');

// All routes require authentication
router.use(authenticateToken);

// Get all users (Admin only)
router.get('/',
  requirePermission('users:read'),
  getUsers
);

// Get user by ID
router.get('/:id',
  requirePermission('users:read'),
  getUserById
);

// Update user (Admin only)
router.put('/:id',
  requirePermission('users:write'),
  updateUser
);

// Delete user (Admin only)
router.delete('/:id',
  requirePermission('users:delete'),
  deleteUser
);

module.exports = router;
