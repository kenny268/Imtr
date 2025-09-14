const { User, Student, Profile, Program } = require('../../models');
const { Op } = require('sequelize');
const { logger } = require('../../config/logger');
const { AppError, NotFoundError, BadRequestError, ConflictError } = require('../../middleware/errorHandler');

class StudentApprovalService {
  /**
   * Get pending student registrations
   */
  async getPendingRegistrations(query = {}) {
    try {
      const { page = 1, limit = 10, search = '', program_id } = query;
      const offset = (page - 1) * limit;

      const whereClause = {
        role: 'STUDENT',
        status: 'pending'
      };

      if (search) {
        whereClause[Op.or] = [
          { email: { [Op.iLike]: `%${search}%` } },
          { '$profile.first_name$': { [Op.iLike]: `%${search}%` } },
          { '$profile.last_name$': { [Op.iLike]: `%${search}%` } }
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where: whereClause,
        include: [
          {
            model: Profile,
            as: 'profile',
            attributes: ['first_name', 'last_name', 'phone', 'gender', 'date_of_birth', 'national_id']
          }
        ],
        attributes: ['id', 'email', 'status', 'created_at', 'last_login_at'],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['created_at', 'DESC']]
      });

      return {
        registrations: rows,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(count / limit),
          total_items: count,
          items_per_page: parseInt(limit)
        }
      };
    } catch (error) {
      logger.error('Error fetching pending registrations:', error);
      throw error;
    }
  }

  /**
   * Approve student registration
   */
  async approveStudentRegistration(userId, approvalData) {
    try {
      const { program_id, enrollment_year, admission_date, scholarship_type, scholarship_amount } = approvalData;

      // Get user with profile
      const user = await User.findByPk(userId, {
        include: [{ model: Profile, as: 'profile' }]
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must have STUDENT role');
      }

      if (user.status !== 'pending') {
        throw new BadRequestError('User is not pending approval');
      }

      // Check if program exists
      const program = await Program.findByPk(program_id);
      if (!program) {
        throw new NotFoundError('Program not found');
      }

      // Check if user is already a student
      const existingStudent = await Student.findOne({
        where: { user_id: userId }
      });

      if (existingStudent) {
        throw new ConflictError('User is already a student');
      }

      // Generate student number
      const studentNo = await this.generateStudentNumber(program_id, enrollment_year);

      // Update user status to active
      await user.update({
        status: 'active',
        email_verified: true
      });

      // Create student record
      const student = await Student.create({
        user_id: userId,
        program_id,
        student_no: studentNo,
        admission_date: admission_date || new Date(),
        enrollment_year: enrollment_year || new Date().getFullYear(),
        status: 'active',
        scholarship_type: scholarship_type || 'none',
        scholarship_amount: scholarship_amount || 0
      });

      // Update program current_students count
      await program.increment('current_students');

      // Get complete student data
      const approvedStudent = await this.getStudentById(student.id);

      logger.info(`Student registration approved: ${user.email} -> ${studentNo}`);

      return approvedStudent;
    } catch (error) {
      logger.error('Error approving student registration:', error);
      throw error;
    }
  }

  /**
   * Reject student registration
   */
  async rejectStudentRegistration(userId, rejectionReason) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must have STUDENT role');
      }

      if (user.status !== 'pending') {
        throw new BadRequestError('User is not pending approval');
      }

      // Update user status to rejected
      await user.update({
        status: 'rejected',
        rejection_reason: rejectionReason
      });

      logger.info(`Student registration rejected: ${user.email} - Reason: ${rejectionReason}`);

      return {
        message: 'Student registration rejected successfully',
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
          rejection_reason: rejectionReason
        }
      };
    } catch (error) {
      logger.error('Error rejecting student registration:', error);
      throw error;
    }
  }

  /**
   * Generate unique student number
   */
  async generateStudentNumber(programId, enrollmentYear) {
    try {
      const year = enrollmentYear.toString().slice(-2);
      const program = await Program.findByPk(programId);
      const programCode = program.code.substring(0, 3).toUpperCase();

      // Find the last student number for this program and year
      const lastStudent = await Student.findOne({
        where: {
          student_no: {
            [Op.like]: `STU${programCode}${year}%`
          }
        },
        order: [['student_no', 'DESC']]
      });

      let sequence = 1;
      if (lastStudent) {
        const lastSequence = parseInt(lastStudent.student_no.slice(-3));
        sequence = lastSequence + 1;
      }

      const studentNo = `STU${programCode}${year}${sequence.toString().padStart(3, '0')}`;

      // Verify uniqueness
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
   * Get student by ID with full details
   */
  async getStudentById(id) {
    try {
      const student = await Student.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            include: [
              {
                model: Profile,
                as: 'profile'
              }
            ],
            attributes: { exclude: ['password_hash', 'email_verification_token'] }
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
   * Update student status
   */
  async updateStudentStatus(studentId, status, reason = null) {
    try {
      const student = await Student.findByPk(studentId, {
        include: [{ model: User, as: 'user' }]
      });

      if (!student) {
        throw new NotFoundError('Student not found');
      }

      // Update student status
      await student.update({ status });

      // If suspending or withdrawing, also update user status
      if (status === 'suspended' || status === 'withdrawn') {
        await student.user.update({ status: 'inactive' });
      } else if (status === 'active') {
        await student.user.update({ status: 'active' });
      }

      logger.info(`Student status updated: ${student.student_no} -> ${status}`);

      return await this.getStudentById(studentId);
    } catch (error) {
      logger.error('Error updating student status:', error);
      throw error;
    }
  }

  /**
   * Get student statistics for admin dashboard
   */
  async getStudentApprovalStats() {
    try {
      const stats = await User.findAll({
        where: { role: 'STUDENT' },
        attributes: [
          'status',
          [User.sequelize.fn('COUNT', User.sequelize.col('User.id')), 'count']
        ],
        group: ['status'],
        raw: true
      });

      const totalStudents = await User.count({ where: { role: 'STUDENT' } });
      const pendingApprovals = await User.count({ 
        where: { role: 'STUDENT', status: 'pending' } 
      });

      return {
        total_students: totalStudents,
        pending_approvals: pendingApprovals,
        status_breakdown: stats.reduce((acc, stat) => {
          acc[stat.status] = parseInt(stat.count);
          return acc;
        }, {})
      };
    } catch (error) {
      logger.error('Error fetching student approval stats:', error);
      throw error;
    }
  }
}

module.exports = new StudentApprovalService();
