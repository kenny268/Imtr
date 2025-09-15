const { Faculty, Department, Program } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, ConflictError, AppError } = require('../../middleware/errorHandler');

class FacultyService {
  // Create a new faculty
  async createFaculty(facultyData) {
    try {
      // Check if faculty with same name or code already exists
      const existingFaculty = await Faculty.findOne({
        where: {
          [Op.or]: [
            { name: facultyData.name },
            { code: facultyData.code }
          ]
        }
      });

      if (existingFaculty) {
        if (existingFaculty.name === facultyData.name) {
          throw new ConflictError('Faculty with this name already exists');
        }
        if (existingFaculty.code === facultyData.code) {
          throw new ConflictError('Faculty with this code already exists');
        }
      }

      const faculty = await Faculty.create(facultyData);
      return faculty;
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new AppError('Failed to create faculty', 500);
    }
  }

  // Get all faculties with pagination and filtering
  async getFaculties(queryParams) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        status = '',
        sortBy = 'created_at',
        sortOrder = 'DESC'
      } = queryParams;

      const offset = (parseInt(page) - 1) * parseInt(limit);

      // Build where clause
      const whereClause = {};
      
      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.iLike]: `%${search}%` } },
          { code: { [Op.iLike]: `%${search}%` } },
          { description: { [Op.iLike]: `%${search}%` } }
        ];
      }

      if (status) {
        whereClause.status = status;
      }

      const { count, rows: faculties } = await Faculty.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Department,
            as: 'departments',
            attributes: ['id', 'name', 'code', 'status'],
            where: { status: 'active' },
            required: false
          }
        ],
        order: [[sortBy, sortOrder]],
        limit: parseInt(limit),
        offset: parseInt(offset),
        distinct: true
      });

      // Calculate additional statistics
      const facultiesWithStats = await Promise.all(
        faculties.map(async (faculty) => {
          const departmentCount = await Department.count({
            where: { faculty_id: faculty.id, status: 'active' }
          });

          const programCount = await Program.count({
            where: { faculty_id: faculty.id }
          });

          return {
            ...faculty.toJSON(),
            department_count: departmentCount,
            program_count: programCount
          };
        })
      );

      return {
        faculties: facultiesWithStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch faculties', 500);
    }
  }

  // Get faculty by ID
  async getFacultyById(id) {
    try {
      const faculty = await Faculty.findByPk(id, {
        include: [
          {
            model: Department,
            as: 'departments',
            attributes: ['id', 'name', 'code', 'status', 'head_name'],
            where: { status: 'active' },
            required: false
          },
          {
            model: Program,
            as: 'programs',
            attributes: ['id', 'name', 'code', 'level', 'status'],
            required: false
          }
        ]
      });

      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }

      return faculty;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch faculty', 500);
    }
  }

  // Update faculty
  async updateFaculty(id, updateData) {
    try {
      const faculty = await Faculty.findByPk(id);
      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }

      // Check for conflicts if name or code is being updated
      if (updateData.name || updateData.code) {
        const whereClause = { id: { [Op.ne]: id } };
        const conflictFields = [];

        if (updateData.name) {
          conflictFields.push({ name: updateData.name });
        }
        if (updateData.code) {
          conflictFields.push({ code: updateData.code });
        }

        whereClause[Op.or] = conflictFields;

        const existingFaculty = await Faculty.findOne({ where: whereClause });
        if (existingFaculty) {
          if (existingFaculty.name === updateData.name) {
            throw new ConflictError('Faculty with this name already exists');
          }
          if (existingFaculty.code === updateData.code) {
            throw new ConflictError('Faculty with this code already exists');
          }
        }
      }

      await faculty.update(updateData);
      return faculty;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new AppError('Failed to update faculty', 500);
    }
  }

  // Delete faculty
  async deleteFaculty(id) {
    try {
      const faculty = await Faculty.findByPk(id);
      if (!faculty) {
        throw new NotFoundError('Faculty not found');
      }

      // Check if faculty has active departments
      const departmentCount = await Department.count({
        where: { faculty_id: id, status: 'active' }
      });

      if (departmentCount > 0) {
        throw new ConflictError('Cannot delete faculty with active departments');
      }

      // Check if faculty has programs
      const programCount = await Program.count({
        where: { faculty_id: id }
      });

      if (programCount > 0) {
        throw new ConflictError('Cannot delete faculty with associated programs');
      }

      await faculty.destroy();
      return { message: 'Faculty deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new AppError('Failed to delete faculty', 500);
    }
  }

  // Get faculty options for dropdowns
  async getFacultyOptions() {
    try {
      const faculties = await Faculty.findAll({
        where: { status: 'active' },
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']]
      });

      return faculties;
    } catch (error) {
      throw new AppError('Failed to fetch faculty options', 500);
    }
  }

  // Get faculty statistics
  async getFacultyStatistics() {
    try {
      const totalFaculties = await Faculty.count();
      const activeFaculties = await Faculty.count({ where: { status: 'active' } });
      const inactiveFaculties = await Faculty.count({ where: { status: 'inactive' } });
      const suspendedFaculties = await Faculty.count({ where: { status: 'suspended' } });

      const facultiesWithDepartments = await Faculty.findAll({
        attributes: [
          'id',
          'name',
          [Faculty.sequelize.fn('COUNT', Faculty.sequelize.col('departments.id')), 'department_count']
        ],
        include: [
          {
            model: Department,
            as: 'departments',
            attributes: [],
            where: { status: 'active' },
            required: false
          }
        ],
        group: ['Faculty.id', 'Faculty.name'],
        order: [[Faculty.sequelize.fn('COUNT', Faculty.sequelize.col('departments.id')), 'DESC']]
      });

      return {
        total_faculties: totalFaculties,
        active_faculties: activeFaculties,
        inactive_faculties: inactiveFaculties,
        suspended_faculties: suspendedFaculties,
        faculties_with_departments: facultiesWithDepartments
      };
    } catch (error) {
      throw new AppError('Failed to fetch faculty statistics', 500);
    }
  }
}

module.exports = new FacultyService();
