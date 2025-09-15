const { Course, Program, Lecturer, ClassSection, Enrollment } = require('../../models');
const { Op } = require('sequelize');
const { NotFoundError, ConflictError, AppError } = require('../../middleware/errorHandler');

class CourseService {
  // Create a new course
  async createCourse(courseData) {
    try {
      // Check if course code already exists
      const existingCourse = await Course.findOne({
        where: { code: courseData.code }
      });

      if (existingCourse) {
        throw new ConflictError('Course code already exists');
      }

      // Validate program exists
      const program = await Program.findByPk(courseData.program_id);
      if (!program) {
        throw new AppError('Invalid program ID', 400);
      }

      // Validate prerequisites if provided
      if (courseData.prerequisites && courseData.prerequisites.length > 0) {
        const prerequisiteCourses = await Course.findAll({
          where: { id: { [Op.in]: courseData.prerequisites } }
        });

        if (prerequisiteCourses.length !== courseData.prerequisites.length) {
          throw new AppError('One or more prerequisite courses not found', 400);
        }
      }

      const course = await Course.create(courseData);
      return await this.getCourseById(course.id);
    } catch (error) {
      throw error;
    }
  }

  // Get all courses with pagination and filters
  async getCourses(queryParams) {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'created_at',
      sortOrder = 'DESC',
      program_id,
      semester,
      year,
      course_type,
      status,
      is_offered
    } = queryParams;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Apply filters
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { code: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (program_id) {
      whereClause.program_id = program_id;
    }

    if (semester) {
      whereClause.semester = semester;
    }

    if (year) {
      whereClause.year = year;
    }

    if (course_type) {
      whereClause.course_type = course_type;
    }

    if (status) {
      whereClause.status = status;
    }

    if (is_offered !== undefined) {
      whereClause.is_offered = is_offered;
    }

    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name', 'code', 'level']
        },
        {
          model: ClassSection,
          as: 'classSections',
          attributes: ['id', 'section_name', 'lecturer_id', 'semester', 'academic_year'],
          include: [{
            model: Lecturer,
            as: 'lecturer',
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
          }],
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
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrollmentCount = await Enrollment.count({
          include: [{
            model: ClassSection,
            as: 'classSection',
            where: { course_id: course.id, status: 'active' }
          }]
        });

        const activeSections = await ClassSection.count({
          where: { course_id: course.id, status: 'active' }
        });

        return {
          ...course.toJSON(),
          enrollment_count: enrollmentCount,
          active_sections: activeSections
        };
      })
    );

    return {
      courses: coursesWithStats,
      pagination: {
        current_page: parseInt(page),
        per_page: parseInt(limit),
        total: count,
        total_pages: Math.ceil(count / limit)
      }
    };
  }

  // Get course by ID
  async getCourseById(id) {
    const course = await Course.findByPk(id, {
      include: [
        {
          model: Program,
          as: 'program',
          attributes: ['id', 'name', 'code', 'level', 'department', 'faculty']
        },
        {
          model: Course,
          as: 'prerequisiteCourses',
          attributes: ['id', 'code', 'title', 'credits'],
          through: { attributes: [] }
        },
        {
          model: ClassSection,
          as: 'classSections',
          attributes: ['id', 'section_name', 'lecturer_id', 'semester', 'academic_year', 'status'],
          include: [{
            model: Lecturer,
            as: 'lecturer',
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
          }],
          order: [['academic_year', 'DESC'], ['semester', 'ASC']]
        }
      ]
    });

    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Calculate statistics
    const enrollmentCount = await Enrollment.count({
      include: [{
        model: ClassSection,
        as: 'classSection',
        where: { course_id: id, status: 'active' }
      }]
    });

    const activeSections = await ClassSection.count({
      where: { course_id: id, status: 'active' }
    });

    return {
      ...course.toJSON(),
      enrollment_count: enrollmentCount,
      active_sections: activeSections
    };
  }

  // Update course
  async updateCourse(id, updateData) {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if new code conflicts with existing courses
    if (updateData.code && updateData.code !== course.code) {
      const existingCourse = await Course.findOne({
        where: { code: updateData.code, id: { [Op.ne]: id } }
      });

      if (existingCourse) {
        throw new ConflictError('Course code already exists');
      }
    }

    // Validate program if provided
    if (updateData.program_id) {
      const program = await Program.findByPk(updateData.program_id);
      if (!program) {
        throw new AppError('Invalid program ID', 400);
      }
    }

    // Validate prerequisites if provided
    if (updateData.prerequisites && updateData.prerequisites.length > 0) {
      const prerequisiteCourses = await Course.findAll({
        where: { id: { [Op.in]: updateData.prerequisites } }
      });

      if (prerequisiteCourses.length !== updateData.prerequisites.length) {
        throw new BadRequestError('One or more prerequisite courses not found');
      }
    }

    await course.update(updateData);
    return await this.getCourseById(id);
  }

  // Delete course
  async deleteCourse(id) {
    const course = await Course.findByPk(id);
    if (!course) {
      throw new NotFoundError('Course not found');
    }

    // Check if course has active class sections
    const activeSections = await ClassSection.count({
      where: { course_id: id, status: 'active' }
    });

    if (activeSections > 0) {
      throw new ConflictError('Cannot delete course with active class sections');
    }

    // Check if course has enrollments
    const enrollmentCount = await Enrollment.count({
      include: [{
        model: ClassSection,
        as: 'classSection',
        where: { course_id: id }
      }]
    });

    if (enrollmentCount > 0) {
      throw new ConflictError('Cannot delete course with student enrollments');
    }

    await course.destroy();
    return { message: 'Course deleted successfully' };
  }

  // Get course statistics
  async getCourseStatistics() {
    const totalCourses = await Course.count();
    const activeCourses = await Course.count({ where: { status: 'active' } });
    const inactiveCourses = await Course.count({ where: { status: 'inactive' } });
    const archivedCourses = await Course.count({ where: { status: 'archived' } });
    const offeredCourses = await Course.count({ where: { is_offered: true } });

    // Courses by type
    const coursesByType = await Course.findAll({
      attributes: [
        'course_type',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('Course.id')), 'count']
      ],
      group: ['course_type'],
      raw: true
    });

    // Courses by year
    const coursesByYear = await Course.findAll({
      attributes: [
        'year',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('Course.id')), 'count']
      ],
      group: ['year'],
      order: [['year', 'ASC']],
      raw: true
    });

    // Courses by semester
    const coursesBySemester = await Course.findAll({
      attributes: [
        'semester',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('Course.id')), 'count']
      ],
      group: ['semester'],
      order: [['semester', 'ASC']],
      raw: true
    });

    // Courses by program
    const coursesByProgram = await Course.findAll({
      attributes: [
        'program_id',
        [Course.sequelize.fn('COUNT', Course.sequelize.col('Course.id')), 'count']
      ],
      include: [{
        model: Program,
        as: 'program',
        attributes: ['name', 'code']
      }],
      group: ['program_id', 'program.id'],
      order: [[Course.sequelize.fn('COUNT', Course.sequelize.col('Course.id')), 'DESC']],
      limit: 10,
      raw: false
    });

    return {
      total_courses: totalCourses,
      active_courses: activeCourses,
      inactive_courses: inactiveCourses,
      archived_courses: archivedCourses,
      offered_courses: offeredCourses,
      courses_by_type: coursesByType,
      courses_by_year: coursesByYear,
      courses_by_semester: coursesBySemester,
      courses_by_program: coursesByProgram
    };
  }

  // Get course options for dropdowns
  async getCourseOptions(programId = null) {
    const whereClause = { status: 'active' };
    if (programId) {
      whereClause.program_id = programId;
    }

    const courses = await Course.findAll({
      where: whereClause,
      attributes: ['id', 'code', 'title', 'credits', 'program_id'],
      include: [{
        model: Program,
        as: 'program',
        attributes: ['name', 'code']
      }],
      order: [['title', 'ASC']]
    });

    return courses;
  }

  // Get courses by program
  async getCoursesByProgram(programId) {
    const courses = await Course.findAll({
      where: { program_id: programId, status: 'active' },
      attributes: ['id', 'code', 'title', 'credits', 'semester', 'year', 'course_type'],
      order: [['year', 'ASC'], ['semester', 'ASC']]
    });

    return courses;
  }
}

module.exports = new CourseService();
