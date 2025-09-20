const authService = require('./auth.service');
const { setTokenCookies, clearTokenCookies } = require('../../middleware/auth');
const { sendSuccess, sendError, sendBadRequest, sendUnauthorized } = require('../../utils/responses');
const { logger } = require('../../config/logger');
const { asyncHandler } = require('../../middleware/errorHandler');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const { user, tokens } = await authService.login(email, password);

  // Set cookies
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  return sendSuccess(res, { user, token: tokens.accessToken }, 'Login successful');
});

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logout successful
 */
const logout = asyncHandler(async (req, res) => {
  // Clear cookies
  clearTokenCookies(res);

  // Logout from service
  await authService.logout(req.user?.id);

  return sendSuccess(res, null, 'Logout successful');
});

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       401:
 *         description: Invalid refresh token
 */
const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return sendUnauthorized(res, 'Refresh token required');
  }

  const tokens = await authService.refreshToken(refreshToken);

  // Set new cookies
  setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

  return sendSuccess(res, null, 'Token refreshed successfully');
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Password reset email sent
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.forgotPassword(email);

  return sendSuccess(res, null, result.message);
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Invalid or expired token
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  const result = await authService.resetPassword(token, newPassword);

  return sendSuccess(res, null, result.message);
});

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user.id);

  return sendSuccess(res, user, 'Profile retrieved successfully');
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - profile
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LECTURER, STUDENT, FINANCE, LIBRARIAN, IT]
 *               profile:
 *                 type: object
 *                 required:
 *                   - firstName
 *                   - lastName
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User already exists
 */
const register = asyncHandler(async (req, res) => {
  const userData = req.body;

  const user = await authService.register(userData);

  return sendSuccess(res, user, 'User registered successfully', 201);
});

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const result = await authService.changePassword(req.user.id, currentPassword, newPassword);

  return sendSuccess(res, null, result.message);
});

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Verify email address
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Email verified successfully
 *       400:
 *         description: Invalid token
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  const result = await authService.verifyEmail(token);

  return sendSuccess(res, null, result.message);
});

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Resend verification email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Verification email sent
 *       400:
 *         description: Email already verified
 */
const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const result = await authService.resendVerificationEmail(email);

  return sendSuccess(res, null, result.message);
});

/**
 * @swagger
 * /auth/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               profile:
 *                 type: object
 *                 properties:
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   phone:
 *                     type: string
 *                   gender:
 *                     type: string
 *                     enum: [male, female, other]
 *                   dateOfBirth:
 *                     type: string
 *                     format: date
 *                   address:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 */
const updateProfile = asyncHandler(async (req, res) => {
  const profileData = req.body;

  const user = await authService.updateProfile(req.user.id, profileData);

  return sendSuccess(res, user, 'Profile updated successfully');
});

module.exports = {
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
};
