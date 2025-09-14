const studentService = require('./student.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class StudentController {
  /**
   * Create a new student
   */
  async createStudent(req, res, next) {
    try {
      const student = await studentService.createStudent(req.body);
      
      sendSuccess(res, student, 'Student created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student by ID
   */
  async getStudentById(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);
      
      sendSuccess(res, student, 'Student retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all students with pagination and filters
   */
  async getStudents(req, res, next) {
    try {
      const result = await studentService.getStudents(req.query);
      
      sendSuccess(res, result, 'Students retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update student
   */
  async updateStudent(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.updateStudent(id, req.body);
      
      sendSuccess(res, student, 'Student updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete student
   */
  async deleteStudent(req, res, next) {
    try {
      const { id } = req.params;
      const result = await studentService.deleteStudent(id);
      
      sendSuccess(res,(result, 'Student deleted successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student statistics
   */
  async getStudentStatistics(req, res, next) {
    try {
      const statistics = await studentService.getStudentStatistics();
      
      sendSuccess(res,(statistics, 'Student statistics retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Generate student number
   */
  async generateStudentNumber(req, res, next) {
    try {
      const { program_id, enrollment_year } = req.body;
      const studentNo = await studentService.generateStudentNumber(program_id, enrollment_year);
      
      sendSuccess(res,({ student_no: studentNo }, 'Student number generated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Bulk update students
   */
  async bulkUpdateStudents(req, res, next) {
    try {
      const { student_ids, updates } = req.body;
      const result = await studentService.bulkUpdateStudents(student_ids, updates);
      
      sendSuccess(res,(result, 'Students updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update academic progress
   */
  async updateAcademicProgress(req, res, next) {
    try {
      const { id } = req.params;
      const student = await studentService.updateAcademicProgress(id, req.body);
      
      sendSuccess(res,(student, 'Academic progress updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student by user ID (for current user)
   */
  async getMyStudentProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const student = await studentService.getStudentByUserId(userId);
      
      sendSuccess(res,(student, 'Student profile retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update my student profile (for current user)
   */
  async updateMyStudentProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const student = await studentService.getStudentByUserId(userId);
      
      const updatedStudent = await studentService.updateStudent(student.id, req.body);
      
      sendSuccess(res,(updatedStudent, 'Student profile updated successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get students by program
   */
  async getStudentsByProgram(req, res, next) {
    try {
      const { programId } = req.params;
      const queryParams = { ...req.query, program_id: programId };
      const result = await studentService.getStudents(queryParams);
      
      sendSuccess(res,(result, 'Students retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student dashboard data
   */
  async getStudentDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const student = await studentService.getStudentByUserId(userId);
      
      // Get additional dashboard data (enrollments, grades, etc.)
      // This would be expanded based on other modules
      const dashboardData = {
        student,
        // Add more dashboard data as modules are implemented
        enrollments: [],
        recent_grades: [],
        upcoming_exams: [],
        notifications: []
      };
      
      sendSuccess(res,(dashboardData, 'Student dashboard data retrieved successfully'));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentController();
