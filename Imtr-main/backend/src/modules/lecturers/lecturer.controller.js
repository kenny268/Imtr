const { Lecturer } = require('../../models');
const { Op } = require('sequelize');
const { sendSuccess, sendError } = require('../../utils/responses');

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
      whereClause.department = department;
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

module.exports = {
  getLecturers,
  getLecturerById
};
