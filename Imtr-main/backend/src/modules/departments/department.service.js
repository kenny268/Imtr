const { Department, Faculty, Program, Lecturer } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, ConflictError, AppError } = require('../../middleware/errorHandler');

class DepartmentService {
  // Create a new department
  async createDepartment(departmentData) {
    try {
      // Check if faculty exists
      const faculty = await Faculty.findByPk(departmentData.faculty_id);
      if (!faculty) {
        throw new AppError('Invalid faculty ID', 400);
      }

      // Check if department with same name or code already exists in the faculty
      const existingDepartment = await Department.findOne({
        where: {
          faculty_id: departmentData.faculty_id,
          [Op.or]: [
            { name: departmentData.name },
            { code: departmentData.code }
          ]
        }
      });

      if (existingDepartment) {
        if (existingDepartment.name === departmentData.name) {
          throw new ConflictError('Department with this name already exists in this faculty');
        }
        if (existingDepartment.code === departmentData.code) {
          throw new ConflictError('Department with this code already exists in this faculty');
        }
      }

      const department = await Department.create(departmentData);
      return department;
    } catch (error) {
      if (error instanceof ConflictError || error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to create department', 500);
    }
  }

  // Get all departments with pagination and filtering
  async getDepartments(queryParams) {
    try {
      const {
        page = 1,
        limit = 20,
        search = '',
        faculty_id = '',
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

      if (faculty_id) {
        whereClause.faculty_id = faculty_id;
      }

      if (status) {
        whereClause.status = status;
      }

      const { count, rows: departments } = await Department.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Faculty,
            as: 'faculty',
            attributes: ['id', 'name', 'code']
          },
          {
            model: Program,
            as: 'programs',
            attributes: ['id', 'name', 'code', 'level', 'status'],
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
      const departmentsWithStats = await Promise.all(
        departments.map(async (department) => {
          const programCount = await Program.count({
            where: { department_id: department.id }
          });

          const lecturerCount = await Lecturer.count({
            where: { department_id: department.id }
          });

          return {
            ...department.toJSON(),
            program_count: programCount,
            lecturer_count: lecturerCount
          };
        })
      );

      return {
        departments: departmentsWithStats,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / parseInt(limit))
        }
      };
    } catch (error) {
      throw new AppError('Failed to fetch departments', 500);
    }
  }

  // Get departments by faculty
  async getDepartmentsByFaculty(facultyId) {
    try {
      const departments = await Department.findAll({
        where: { 
          faculty_id: facultyId,
          status: 'active'
        },
        attributes: ['id', 'name', 'code'],
        order: [['name', 'ASC']]
      });

      return departments;
    } catch (error) {
      throw new AppError('Failed to fetch departments by faculty', 500);
    }
  }

  // Get department by ID
  async getDepartmentById(id) {
    try {
      const department = await Department.findByPk(id, {
        include: [
          {
            model: Faculty,
            as: 'faculty',
            attributes: ['id', 'name', 'code', 'dean_name']
          },
          {
            model: Program,
            as: 'programs',
            attributes: ['id', 'name', 'code', 'level', 'status'],
            required: false
          },
          {
            model: Lecturer,
            as: 'lecturers',
            attributes: ['id', 'staff_no', 'user_id'],
            required: false,
            include: [{
              model: require('../../models').User,
              as: 'user',
              attributes: ['id', 'email'],
              include: [{
                model: require('../../models').Profile,
                as: 'profile',
                attributes: ['first_name', 'last_name']
              }]
            }]
          }
        ]
      });

      if (!department) {
        throw new NotFoundError('Department not found');
      }

      return department;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new AppError('Failed to fetch department', 500);
    }
  }

  // Update department
  async updateDepartment(id, updateData) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new NotFoundError('Department not found');
      }

      // Check if faculty exists if faculty_id is being updated
      if (updateData.faculty_id) {
        const faculty = await Faculty.findByPk(updateData.faculty_id);
        if (!faculty) {
          throw new AppError('Invalid faculty ID', 400);
        }
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

        // If faculty_id is being updated, check within that faculty
        if (updateData.faculty_id) {
          whereClause.faculty_id = updateData.faculty_id;
        } else {
          whereClause.faculty_id = department.faculty_id;
        }

        const existingDepartment = await Department.findOne({ where: whereClause });
        if (existingDepartment) {
          if (existingDepartment.name === updateData.name) {
            throw new ConflictError('Department with this name already exists in this faculty');
          }
          if (existingDepartment.code === updateData.code) {
            throw new ConflictError('Department with this code already exists in this faculty');
          }
        }
      }

      await department.update(updateData);
      return department;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError || error instanceof AppError) {
        throw error;
      }
      throw new AppError('Failed to update department', 500);
    }
  }

  // Delete department
  async deleteDepartment(id) {
    try {
      const department = await Department.findByPk(id);
      if (!department) {
        throw new NotFoundError('Department not found');
      }

      // Check if department has programs
      const programCount = await Program.count({
        where: { department_id: id }
      });

      if (programCount > 0) {
        throw new ConflictError('Cannot delete department with associated programs');
      }

      // Check if department has lecturers
      const lecturerCount = await Lecturer.count({
        where: { department_id: id }
      });

      if (lecturerCount > 0) {
        throw new ConflictError('Cannot delete department with associated lecturers');
      }

      await department.destroy();
      return { message: 'Department deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new AppError('Failed to delete department', 500);
    }
  }

  // Get department options for dropdowns
  async getDepartmentOptions(facultyId = null) {
    try {
      const whereClause = { status: 'active' };
      if (facultyId) {
        whereClause.faculty_id = facultyId;
      }

      const departments = await Department.findAll({
        where: whereClause,
        attributes: ['id', 'name', 'code', 'faculty_id'],
        include: [
          {
            model: Faculty,
            as: 'faculty',
            attributes: ['id', 'name', 'code']
          }
        ],
        order: [['name', 'ASC']]
      });

      return departments;
    } catch (error) {
      throw new AppError('Failed to fetch department options', 500);
    }
  }

  // Get department statistics
  async getDepartmentStatistics() {
    try {
      const totalDepartments = await Department.count();
      const activeDepartments = await Department.count({ where: { status: 'active' } });
      const inactiveDepartments = await Department.count({ where: { status: 'inactive' } });
      const suspendedDepartments = await Department.count({ where: { status: 'suspended' } });

      const departmentsByFaculty = await Department.findAll({
        attributes: [
          'faculty_id',
          [Department.sequelize.fn('COUNT', Department.sequelize.col('Department.id')), 'count']
        ],
        include: [
          {
            model: Faculty,
            as: 'faculty',
            attributes: ['id', 'name', 'code']
          }
        ],
        group: ['Department.faculty_id', 'faculty.id', 'faculty.name', 'faculty.code'],
        order: [[Department.sequelize.fn('COUNT', Department.sequelize.col('Department.id')), 'DESC']]
      });

      return {
        total_departments: totalDepartments,
        active_departments: activeDepartments,
        inactive_departments: inactiveDepartments,
        suspended_departments: suspendedDepartments,
        departments_by_faculty: departmentsByFaculty
      };
    } catch (error) {
      throw new AppError('Failed to fetch department statistics', 500);
    }
  }
}

module.exports = new DepartmentService();
