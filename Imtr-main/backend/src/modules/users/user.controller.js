const { User, Profile } = require('../../models');
const { sendSuccess, sendError } = require('../../utils/responses');
const { asyncHandler } = require('../../middleware/errorHandler');
const { requirePermission } = require('../../middleware/rbac');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [ADMIN, LECTURER, STUDENT, FINANCE, LIBRARIAN, IT]
 *     responses:
 *       200:
 *         description: List of users
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search } = req.query;
  const offset = (page - 1) * limit;

  const whereClause = {};
  if (role) whereClause.role = role;
  if (search) {
    whereClause[require('sequelize').Op.or] = [
      { email: { [require('sequelize').Op.like]: `%${search}%` } }
    ];
  }

  const { count, rows: users } = await User.findAndCountAll({
    where: whereClause,
    include: ['profile'],
    attributes: { exclude: ['password_hash'] },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['created_at', 'DESC']]
  });

  return sendSuccess(res, {
    users,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: Math.ceil(count / limit)
    }
  }, 'Users retrieved successfully');
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *       404:
 *         description: User not found
 */
const getUserById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id, {
    include: ['profile'],
    attributes: { exclude: ['password_hash'] }
  });

  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  return sendSuccess(res, user, 'User retrieved successfully');
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
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
 *               role:
 *                 type: string
 *                 enum: [ADMIN, LECTURER, STUDENT, FINANCE, LIBRARIAN, IT]
 *               status:
 *                 type: string
 *                 enum: [active, inactive, pending, suspended]
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { profile, ...userData } = req.body;

  const user = await User.findByPk(id, {
    include: ['profile']
  });
  
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  // Update user data (excluding profile)
  if (Object.keys(userData).length > 0) {
    await user.update(userData);
  }

  // Update profile data if provided
  if (profile && user.profile) {
    await user.profile.update(profile);
  } else if (profile && !user.profile) {
    // Create profile if it doesn't exist
    await Profile.create({
      user_id: user.id,
      ...profile
    });
  }

  // Fetch updated user with profile
  const updatedUser = await User.findByPk(id, {
    include: ['profile'],
    attributes: { exclude: ['password_hash'] }
  });

  return sendSuccess(res, updatedUser, 'User updated successfully');
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findByPk(id);
  if (!user) {
    return sendError(res, 'User not found', 404);
  }

  await user.destroy();

  return sendSuccess(res, null, 'User deleted successfully');
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  deleteUser
};
