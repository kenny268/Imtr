const studentApprovalService = require('./student-approval.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class StudentApprovalController {
  /**
   * Get pending student registrations
   */
  async getPendingRegistrations(req, res, next) {
    try {
      const result = await studentApprovalService.getPendingRegistrations(req.query);
      sendSuccess(res, result, 'Pending registrations retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve student registration
   */
  async approveStudentRegistration(req, res, next) {
    try {
      const { userId } = req.params;
      const approvedStudent = await studentApprovalService.approveStudentRegistration(userId, req.body);
      sendSuccess(res, approvedStudent, 'Student registration approved successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject student registration
   */
  async rejectStudentRegistration(req, res, next) {
    try {
      const { userId } = req.params;
      const { rejection_reason } = req.body;
      const result = await studentApprovalService.rejectStudentRegistration(userId, rejection_reason);
      sendSuccess(res, result, 'Student registration rejected successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update student status
   */
  async updateStudentStatus(req, res, next) {
    try {
      const { studentId } = req.params;
      const { status, reason } = req.body;
      const updatedStudent = await studentApprovalService.updateStudentStatus(studentId, status, reason);
      sendSuccess(res, updatedStudent, 'Student status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student approval statistics
   */
  async getStudentApprovalStats(req, res, next) {
    try {
      const stats = await studentApprovalService.getStudentApprovalStats();
      sendSuccess(res, stats, 'Student approval statistics retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentApprovalController();
