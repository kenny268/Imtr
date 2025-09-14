const studentOnboardingService = require('./student-onboarding.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class StudentOnboardingController {
  /**
   * Get student onboarding status
   */
  async getOnboardingStatus(req, res, next) {
    try {
      const userId = req.user.id;
      const status = await studentOnboardingService.getOnboardingStatus(userId);
      sendSuccess(res, status, 'Onboarding status retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Complete student profile
   */
  async completeProfile(req, res, next) {
    try {
      const userId = req.user.id;
      const updatedUser = await studentOnboardingService.completeProfile(userId, req.body);
      sendSuccess(res, updatedUser, 'Profile completed successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get student dashboard
   */
  async getStudentDashboard(req, res, next) {
    try {
      const userId = req.user.id;
      const dashboard = await studentOnboardingService.getStudentDashboard(userId);
      sendSuccess(res, dashboard, 'Student dashboard retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get onboarding checklist
   */
  async getOnboardingChecklist(req, res, next) {
    try {
      const userId = req.user.id;
      const checklist = await studentOnboardingService.getOnboardingChecklist(userId);
      sendSuccess(res, checklist, 'Onboarding checklist retrieved successfully');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new StudentOnboardingController();
