const { Lecturer, User, Profile, Department } = require('../../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../../utils/responses');
const bcrypt = require('bcryptjs');

const getLecturers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, department, status } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (search) {
      whereClause[Op.or] = [
        { staff_no: { [Op.iLike]: `%${search}%` } },
        { specialization: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (department) {
      whereClause.department_id = department;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows: lecturers } = await Lecturer.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: require('../../models').User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'status'],
          required: true,
          include: [{
            model: require('../../models').Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'middle_name', 'phone'],
            required: false
          }]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
          required: false
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });

    const totalPages = Math.ceil(count / limit);

    const pagination = {
      page: parseInt(page),
      limit: parseInt(limit),
      total: count,
      pages: totalPages
    };

    sendSuccess(res, 'Lecturers retrieved successfully', {
      lecturers,
      pagination
    });
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

const getLecturerById = async (req, res) => {
  try {
    const { id } = req.params;

    const lecturer = await Lecturer.findByPk(id, {
      include: [
        {
          model: require('../../models').User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'status'],
          required: true,
          include: [{
            model: require('../../models').Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'middle_name', 'phone'],
            required: false
          }]
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name', 'code'],
          required: false
        }
      ]
    });

    if (!lecturer) {
      return sendError(res, 'Lecturer not found', 404);
    }

    sendSuccess(res, 'Lecturer retrieved successfully', { lecturer });
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

const createLecturer = async (req, res) => {
  try {
    const { email, password, role = 'LECTURER', profile, lecturer: lecturerData } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return sendError(res, 'User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      role,
      status: 'active'
    });

    // Create profile
    const profileData = await Profile.create({
      user_id: user.id,
      ...profile
    });

    // Create lecturer
    const lecturer = await Lecturer.create({
      user_id: user.id,
      ...lecturerData
    });

    // Fetch the complete lecturer with associations
    const completeLecturer = await Lecturer.findByPk(lecturer.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone', 'gender', 'date_of_birth', 'address', 'city', 'county', 'national_id'],
          }],
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name'],
        }
      ]
    });

    sendSuccess(res, 'Lecturer created successfully', completeLecturer, 201);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

const updateLecturer = async (req, res) => {
  try {
    const { id } = req.params;
    const { profile, lecturer: lecturerData } = req.body;

    const lecturer = await Lecturer.findByPk(id, {
      include: [{
        model: User,
        as: 'user',
        include: [{
          model: Profile,
          as: 'profile'
        }]
      }]
    });

    if (!lecturer) {
      return sendError(res, 'Lecturer not found', 404);
    }

    // Update profile
    if (profile) {
      await lecturer.user.profile.update(profile);
    }

    // Update lecturer data
    if (lecturerData) {
      await lecturer.update(lecturerData);
    }

    // Fetch updated lecturer with associations
    const updatedLecturer = await Lecturer.findByPk(id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone', 'gender', 'date_of_birth', 'address', 'city', 'county', 'national_id'],
          }],
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name'],
        }
      ]
    });

    sendSuccess(res, 'Lecturer updated successfully', updatedLecturer);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

const deleteLecturer = async (req, res) => {
  try {
    const { id } = req.params;

    const lecturer = await Lecturer.findByPk(id, {
      include: [{
        model: User,
        as: 'user'
      }]
    });

    if (!lecturer) {
      return sendError(res, 'Lecturer not found', 404);
    }

    // Delete lecturer (this will cascade to user and profile due to foreign key constraints)
    await lecturer.destroy();

    sendSuccess(res, 'Lecturer deleted successfully', null);
  } catch (error) {
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

module.exports = {
  getLecturers,
  getLecturerById,
  createLecturer,
  updateLecturer,
  deleteLecturer
};
