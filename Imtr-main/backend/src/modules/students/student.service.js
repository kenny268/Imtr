const { Student, User, Program, Profile } = require('../../models');
const { NotFoundError, ConflictError, BadRequestError } = require('../../utils/responses');
const { Op } = require('sequelize');

class StudentService {
  /**
   * Generate unique student number
   */
  async generateStudentNumber(programId, enrollmentYear) {
    try {
      const program = await Program.findByPk(programId);
      if (!program) {
        throw new NotFoundError('Program not found');
      }

      const year = enrollmentYear.toString().slice(-2);
      const programCode = program.code.substring(0, 3).toUpperCase();
      
      // Find the last student number for this program and year
      const lastStudent = await Student.findOne({
        where: {
          program_id: programId,
          enrollment_year: enrollmentYear
        },
        order: [['student_no', 'DESC']]
      });

      let sequence = 1;
      if (lastStudent && lastStudent.student_no) {
        const lastSequence = parseInt(lastStudent.student_no.slice(-3));
        sequence = lastSequence + 1;
      }

      const studentNo = `STU${programCode}${year}${sequence.toString().padStart(3, '0')}`;
      
      // Ensure uniqueness
      const existingStudent = await Student.findOne({
        where: { student_no: studentNo }
      });

      if (existingStudent) {
        return this.generateStudentNumber(programId, enrollmentYear);
      }

      return studentNo;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Create a new student
   */
  async createStudent(studentData) {
    try {
      const { user_id, program_id, enrollment_year, ...otherData } = studentData;

      // Check if user exists and has STUDENT role
      const user = await User.findByPk(user_id, {
        include: [{ model: Profile, as: 'profile' }]
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must have STUDENT role');
      }

      // Check if user is already a student
      const existingStudent = await Student.findOne({
        where: { user_id }
      });

      if (existingStudent) {
        throw new ConflictError('User is already a student');
      }

      // Check if program exists
      const program = await Program.findByPk(program_id);
      if (!program) {
        throw new NotFoundError('Program not found');
      }

      // Generate student number
      const student_no = await this.generateStudentNumber(program_id, enrollment_year);

      // Create student
      const student = await Student.create({
        user_id,
        program_id,
        student_no,
        enrollment_year,
        ...otherData
      });

      // Update program current_students count
      await program.increment('current_students');

      // Fetch student with associations
      const createdStudent = await this.getStudentById(student.id);

      return createdStudent;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student by ID
   */
  async getStudentById(id) {
    try {
      const student = await Student.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            include: [{ model: Profile, as: 'profile' }]
          },
          {
            model: Program,
            as: 'program'
          }
        ]
      });

      if (!student) {
        throw new NotFoundError('Student not found');
      }

      return student;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all students with pagination and filters
   */
  async getStudents(queryParams) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        program_id,
        status,
        enrollment_year,
        sort_by = 'created_at',
        sort_order = 'DESC'
      } = queryParams;

      const offset = (page - 1) * limit;
      const where = {};

      // Apply filters
      if (program_id) {
        where.program_id = program_id;
      }

      if (status) {
        where.status = status;
      }

      if (enrollment_year) {
        where.enrollment_year = enrollment_year;
      }

      // Search functionality
      if (search) {
        where[Op.or] = [
          { student_no: { [Op.like]: `%${search}%` } },
          { '$user.email$': { [Op.like]: `%${search}%` } },
          { '$user.profile.first_name$': { [Op.like]: `%${search}%` } },
          { '$user.profile.last_name$': { [Op.like]: `%${search}%` } }
        ];
      }

      const { count, rows } = await Student.findAndCountAll({
        where,
        include: [
          {
            model: User,
            as: 'user',
            include: [{ model: Profile, as: 'profile' }]
          },
          {
            model: Program,
            as: 'program'
          }
        ],
        order: [[sort_by, sort_order]],
        limit: parseInt(limit),
        offset: parseInt(offset)
      });

      return {
        students: rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: count,
          total_pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update student
   */
  async updateStudent(id, updateData) {
    try {
      const student = await Student.findByPk(id);
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      // If updating program, generate new student number
      if (updateData.program_id && updateData.program_id !== student.program_id) {
        const program = await Program.findByPk(updateData.program_id);
        if (!program) {
          throw new NotFoundError('Program not found');
        }

        updateData.student_no = await this.generateStudentNumber(
          updateData.program_id,
          updateData.enrollment_year || student.enrollment_year
        );

        // Update program counts
        await Program.decrement('current_students', { where: { id: student.program_id } });
        await Program.increment('current_students', { where: { id: updateData.program_id } });
      }

      await student.update(updateData);

      return this.getStudentById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(id) {
    try {
      const student = await Student.findByPk(id);
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      // Update program current_students count
      await Program.decrement('current_students', { where: { id: student.program_id } });

      await student.destroy();

      return { message: 'Student deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student statistics
   */
  async getStudentStatistics() {
    try {
      const totalStudents = await Student.count();
      const activeStudents = await Student.count({ where: { status: 'active' } });
      const graduatedStudents = await Student.count({ where: { status: 'graduated' } });
      const suspendedStudents = await Student.count({ where: { status: 'suspended' } });

      // Students by program
      const studentsByProgram = await Student.findAll({
        attributes: [
          'program_id',
          [Student.sequelize.fn('COUNT', Student.sequelize.col('Student.id')), 'count']
        ],
        include: [
          {
            model: Program,
            as: 'program',
            attributes: ['name', 'code']
          }
        ],
        group: ['Student.program_id', 'program.id'],
        raw: false
      });

      // Students by enrollment year
      const studentsByYear = await Student.findAll({
        attributes: [
          'enrollment_year',
          [Student.sequelize.fn('COUNT', Student.sequelize.col('id')), 'count']
        ],
        group: ['enrollment_year'],
        order: [['enrollment_year', 'DESC']],
        raw: true
      });

      return {
        total_students: totalStudents,
        active_students: activeStudents,
        graduated_students: graduatedStudents,
        suspended_students: suspendedStudents,
        students_by_program: studentsByProgram,
        students_by_year: studentsByYear
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Bulk update students
   */
  async bulkUpdateStudents(studentIds, updates) {
    try {
      const students = await Student.findAll({
        where: { id: studentIds }
      });

      if (students.length !== studentIds.length) {
        throw new BadRequestError('Some students not found');
      }

      await Student.update(updates, {
        where: { id: studentIds }
      });

      return { message: `${students.length} students updated successfully` };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update academic progress
   */
  async updateAcademicProgress(id, progressData) {
    try {
      const student = await Student.findByPk(id);
      if (!student) {
        throw new NotFoundError('Student not found');
      }

      await student.update(progressData);

      return this.getStudentById(id);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get student by user ID
   */
  async getStudentByUserId(userId) {
    try {
      const student = await Student.findOne({
        where: { user_id: userId },
        include: [
          {
            model: User,
            as: 'user',
            include: [{ model: Profile, as: 'profile' }]
          },
          {
            model: Program,
            as: 'program'
          }
        ]
      });

      if (!student) {
        throw new NotFoundError('Student not found');
      }

      return student;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new StudentService();
