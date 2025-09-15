const { Program, Lecturer, Student, Course } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, ConflictError, AppError } = require('../../middleware/errorHandler');

class ProgramService {
  // Create a new program
  async createProgram(programData) {
    try {
      // Check if program code already exists
      const existingProgram = await Program.findOne({
        where: { code: programData.code }
      });

      if (existingProgram) {
        throw new ConflictError('Program code already exists');
      }

      // Validate coordinator if provided
      if (programData.coordinator_id) {
        const coordinator = await Lecturer.findByPk(programData.coordinator_id);
        if (!coordinator) {
          throw new AppError('Invalid coordinator ID', 400);
        }
      }

      const program = await Program.create(programData);
      return await this.getProgramById(program.id);
    } catch (error) {
      throw error;
    }
  }

  // Get all programs with pagination and filters
  async getPrograms(queryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      level,
      status,
      department,
      faculty
    } = queryParams;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (level) {
      whereClause.level = level;
    }

    if (status) {
      whereClause.status = status;
    }

    if (department) {
      whereClause.department = { [Op.iLike]: `%${department}%` };
    }

    if (faculty) {
      whereClause.faculty = { [Op.iLike]: `%${faculty}%` };
    }

    const { count, rows: programs } = await Program.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Lecturer,
          as: 'coordinator',
          attributes: ['id', 'staff_no', 'user_id'],
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
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id'],
          where: { status: 'active' },
          required: false
        },
        {
          model: Course,
          as: 'courses',
          attributes: ['id', 'code', 'title', 'credits', 'status'],
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
    const programsWithStats = await Promise.all(
      programs.map(async (program) => {
        const studentCount = await Student.count({
          where: { program_id: program.id, status: 'active' }
        });

        const courseCount = await Course.count({
          where: { program_id: program.id, status: 'active' }
        });

        return {
          ...program.toJSON(),
          student_count: studentCount,
          course_count: courseCount
        };
      })
    );

    return {
      programs: programsWithStats,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  // Get program by ID
  async getProgramById(id) {
    const program = await Program.findByPk(id, {
      include: [
        {
          model: Lecturer,
          as: 'coordinator',
          attributes: ['id', 'staff_no', 'user_id'],
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
        },
        {
          model: Student,
          as: 'students',
          attributes: ['id', 'student_no', 'user_id'],
          include: [{
            model: require('../../models').User,
            as: 'user',
            attributes: ['id', 'email'],
            include: [{
              model: require('../../models').Profile,
              as: 'profile',
              attributes: ['first_name', 'last_name']
            }]
          }],
          limit: 10
        },
        {
          model: Course,
          as: 'courses',
          attributes: ['id', 'code', 'title', 'credits', 'semester', 'year', 'course_type', 'status'],
          order: [['year', 'ASC'], ['semester', 'ASC']]
        }
      ]
    });

    if (!program) {
      throw new NotFoundError('Program not found');
    }

    // Calculate statistics
    const studentCount = await Student.count({
      where: { program_id: id, status: 'active' }
    });

    const courseCount = await Course.count({
      where: { program_id: id, status: 'active' }
    });

    return {
      ...program.toJSON(),
      student_count: studentCount,
      course_count: courseCount
    };
  }

  // Update program
  async updateProgram(id, updateData) {
    const program = await Program.findByPk(id);
    if (!program) {
      throw new NotFoundError('Program not found');
    }

    // Check if new code conflicts with existing programs
    if (updateData.code && updateData.code !== program.code) {
      const existingProgram = await Program.findOne({
        where: { code: updateData.code, id: { [Op.ne]: id } }
      });

      if (existingProgram) {
        throw new ConflictError('Program code already exists');
      }
    }

    // Validate coordinator if provided
    if (updateData.coordinator_id) {
      const coordinator = await Lecturer.findByPk(updateData.coordinator_id);
      if (!coordinator) {
        throw new AppError('Invalid coordinator ID', 400);
      }
    }

    await program.update(updateData);
    return await this.getProgramById(id);
  }

  // Delete program
  async deleteProgram(id) {
    const program = await Program.findByPk(id);
    if (!program) {
      throw new NotFoundError('Program not found');
    }

    // Check if program has active students
    const activeStudents = await Student.count({
      where: { program_id: id, status: 'active' }
    });

    if (activeStudents > 0) {
      throw new ConflictError('Cannot delete program with active students');
    }

    // Check if program has courses
    const courseCount = await Course.count({
      where: { program_id: id }
    });

    if (courseCount > 0) {
      throw new ConflictError('Cannot delete program with associated courses');
    }

    await program.destroy();
    return { message: 'Program deleted successfully' };
  }

  // Get program statistics
  async getProgramStatistics() {
    const totalPrograms = await Program.count();
    const activePrograms = await Program.count({ where: { status: 'active' } });
    const inactivePrograms = await Program.count({ where: { status: 'inactive' } });
    const suspendedPrograms = await Program.count({ where: { status: 'suspended' } });
    const archivedPrograms = await Program.count({ where: { status: 'archived' } });

    // Programs by level
    const programsByLevel = await Program.findAll({
      attributes: [
        'level',
        [Program.sequelize.fn('COUNT', Program.sequelize.col('Program.id')), 'count']
      ],
      group: ['level'],
      raw: true
    });

    // Programs by department
    const programsByDepartment = await Program.findAll({
      attributes: [
        'department',
        [Program.sequelize.fn('COUNT', Program.sequelize.col('Program.id')), 'count']
      ],
      where: { department: { [Op.ne]: null } },
      group: ['department'],
      order: [[Program.sequelize.fn('COUNT', Program.sequelize.col('Program.id')), 'DESC']],
      limit: 10,
      raw: true
    });

    // Programs by faculty
    const programsByFaculty = await Program.findAll({
      attributes: [
        'faculty',
        [Program.sequelize.fn('COUNT', Program.sequelize.col('Program.id')), 'count']
      ],
      where: { faculty: { [Op.ne]: null } },
      group: ['faculty'],
      order: [[Program.sequelize.fn('COUNT', Program.sequelize.col('Program.id')), 'DESC']],
      limit: 10,
      raw: true
    });

    return {
      total_programs: totalPrograms,
      active_programs: activePrograms,
      inactive_programs: inactivePrograms,
      suspended_programs: suspendedPrograms,
      archived_programs: archivedPrograms,
      programs_by_level: programsByLevel,
      programs_by_department: programsByDepartment,
      programs_by_faculty: programsByFaculty
    };
  }

  // Get program options for dropdowns
  async getProgramOptions() {
    const programs = await Program.findAll({
      where: { status: 'active' },
      attributes: ['id', 'name', 'code', 'level', 'department'],
      order: [['name', 'ASC']]
    });

    return programs;
  }
}

module.exports = new ProgramService();
