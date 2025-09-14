const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  verifyEmail,
  resendVerification,
  getProfile,
  updateProfile
} = require('./auth.controller');

const { validate } = require('../../middleware/validate');
const { authSchemas } = require('../../middleware/validate');
const { authenticateToken, authorize } = require('../../middleware/auth');
const { authLimiter, passwordResetLimiter } = require('../../middleware/rateLimiter');

// Public routes - Registration disabled for security
// router.post('/register', ...) - DISABLED: Only admins can create accounts

router.post('/login', 
  authLimiter,
  validate(authSchemas.login, 'body'),
  login
);

router.post('/logout', logout);

router.post('/refresh', refreshToken);

router.post('/forgot-password',
  passwordResetLimiter,
  validate(authSchemas.forgotPassword, 'body'),
  forgotPassword
);

router.post('/reset-password',
  passwordResetLimiter,
  validate(authSchemas.resetPassword, 'body'),
  resetPassword
);

router.post('/verify-email',
  validate(authSchemas.verifyEmail, 'body'),
  verifyEmail
);

router.post('/resend-verification',
  validate(authSchemas.resendVerification, 'body'),
  resendVerification
);

// Admin-only routes
router.post('/admin/create-user',
  authenticateToken,
  authorize('ADMIN'),
  authLimiter,
  validate(authSchemas.register, 'body'),
  register
);

// Protected routes
router.get('/me',
  authenticateToken,
  getProfile
);

router.put('/profile',
  authenticateToken,
  validate(authSchemas.updateProfile, 'body'),
  updateProfile
);

router.put('/complete-profile',
  authenticateToken,
  validate(authSchemas.updateProfile, 'body'),
  updateProfile
);

router.post('/change-password',
  authenticateToken,
  validate(authSchemas.changePassword, 'body'),
  changePassword
);

module.exports = router;
