const { User, Student, Profile, Program } = require('../../models');
const { logger } = require('../../config/logger');
const { AppError, NotFoundError, BadRequestError } = require('../../middleware/errorHandler');

class StudentOnboardingService {
  /**
   * Get student onboarding status
   */
  async getOnboardingStatus(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Profile,
            as: 'profile'
          },
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: Program,
                as: 'program'
              }
            ]
          }
        ],
        attributes: { exclude: ['password_hash', 'email_verification_token'] }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must be a student');
      }

      // Calculate onboarding progress
      const profile = user.profile;
      const student = user.student;
      
      const onboardingSteps = [
        {
          id: 'profile_completion',
          title: 'Complete Profile',
          description: 'Fill in your personal information',
          completed: this.isProfileComplete(profile),
          required: true
        },
        {
          id: 'student_verification',
          title: 'Student Verification',
          description: 'Verify your student status',
          completed: !!student && student.status === 'active',
          required: true
        },
        {
          id: 'program_enrollment',
          title: 'Program Enrollment',
          description: 'Enroll in your academic program',
          completed: !!student && !!student.program_id,
          required: true
        },
        {
          id: 'profile_photo',
          title: 'Profile Photo',
          description: 'Upload your profile photo',
          completed: !!profile && !!profile.profile_photo,
          required: false
        },
        {
          id: 'emergency_contact',
          title: 'Emergency Contact',
          description: 'Add emergency contact information',
          completed: !!profile && !!profile.emergency_contact_name,
          required: false
        }
      ];

      const completedSteps = onboardingSteps.filter(step => step.completed).length;
      const requiredSteps = onboardingSteps.filter(step => step.required).length;
      const completedRequiredSteps = onboardingSteps.filter(step => step.required && step.completed).length;

      const progress = {
        overall_progress: Math.round((completedSteps / onboardingSteps.length) * 100),
        required_progress: Math.round((completedRequiredSteps / requiredSteps) * 100),
        can_access_system: completedRequiredSteps === requiredSteps,
        steps: onboardingSteps
      };

      return {
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
          role: user.role
        },
        profile: profile,
        student: student,
        onboarding: progress
      };
    } catch (error) {
      logger.error('Error getting onboarding status:', error);
      throw error;
    }
  }

  /**
   * Complete student profile
   */
  async completeProfile(userId, profileData) {
    try {
      const user = await User.findByPk(userId, {
        include: [{ model: Profile, as: 'profile' }]
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must be a student');
      }

      // Update or create profile
      let profile = user.profile;
      if (profile) {
        await profile.update(profileData);
      } else {
        profile = await Profile.create({
          user_id: userId,
          ...profileData
        });
      }

      // Get updated user with profile
      const updatedUser = await User.findByPk(userId, {
        include: [
          {
            model: Profile,
            as: 'profile'
          },
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: Program,
                as: 'program'
              }
            ]
          }
        ],
        attributes: { exclude: ['password_hash', 'email_verification_token'] }
      });

      logger.info(`Student profile completed: ${user.email}`);

      return updatedUser;
    } catch (error) {
      logger.error('Error completing profile:', error);
      throw error;
    }
  }

  /**
   * Get student dashboard data
   */
  async getStudentDashboard(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Profile,
            as: 'profile'
          },
          {
            model: Student,
            as: 'student',
            include: [
              {
                model: Program,
                as: 'program'
              }
            ]
          }
        ],
        attributes: { exclude: ['password_hash', 'email_verification_token'] }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.role !== 'STUDENT') {
        throw new BadRequestError('User must be a student');
      }

      // Get recent activities, notifications, etc.
      const dashboardData = {
        user: {
          id: user.id,
          email: user.email,
          status: user.status,
          last_login_at: user.last_login_at
        },
        profile: user.profile,
        student: user.student,
        quick_stats: {
          total_courses: 0, // Will be implemented with course enrollment
          completed_courses: 0,
          current_gpa: user.student?.gpa || 0,
          credits_completed: user.student?.completed_credits || 0,
          total_credits: user.student?.total_credits || 0
        },
        recent_activities: [], // Will be implemented with activity tracking
        upcoming_events: [], // Will be implemented with calendar integration
        notifications: [] // Will be implemented with notification system
      };

      return dashboardData;
    } catch (error) {
      logger.error('Error getting student dashboard:', error);
      throw error;
    }
  }

  /**
   * Check if profile is complete
   */
  isProfileComplete(profile) {
    if (!profile) return false;

    const requiredFields = [
      'first_name',
      'last_name',
      'phone',
      'gender',
      'date_of_birth',
      'address',
      'national_id'
    ];

    return requiredFields.every(field => profile[field] && profile[field].toString().trim() !== '');
  }

  /**
   * Get student onboarding checklist
   */
  async getOnboardingChecklist(userId) {
    try {
      const status = await this.getOnboardingStatus(userId);
      
      const checklist = {
        profile_completion: {
          title: 'Complete Your Profile',
          description: 'Fill in all required personal information',
          completed: status.onboarding.steps.find(s => s.id === 'profile_completion')?.completed || false,
          action_required: !status.onboarding.steps.find(s => s.id === 'profile_completion')?.completed,
          next_step: 'Complete your profile with personal details'
        },
        student_verification: {
          title: 'Student Verification',
          description: 'Wait for admin approval of your student status',
          completed: status.onboarding.steps.find(s => s.id === 'student_verification')?.completed || false,
          action_required: false,
          next_step: 'Contact admin if verification is taking too long'
        },
        program_enrollment: {
          title: 'Program Enrollment',
          description: 'Get enrolled in your academic program',
          completed: status.onboarding.steps.find(s => s.id === 'program_enrollment')?.completed || false,
          action_required: false,
          next_step: 'Contact admin to complete program enrollment'
        },
        profile_photo: {
          title: 'Upload Profile Photo',
          description: 'Add a profile photo (optional)',
          completed: status.onboarding.steps.find(s => s.id === 'profile_photo')?.completed || false,
          action_required: !status.onboarding.steps.find(s => s.id === 'profile_photo')?.completed,
          next_step: 'Upload a profile photo for better identification'
        },
        emergency_contact: {
          title: 'Emergency Contact',
          description: 'Add emergency contact information (optional)',
          completed: status.onboarding.steps.find(s => s.id === 'emergency_contact')?.completed || false,
          action_required: !status.onboarding.steps.find(s => s.id === 'emergency_contact')?.completed,
          next_step: 'Add emergency contact for safety purposes'
        }
      };

      return {
        checklist,
        overall_progress: status.onboarding.overall_progress,
        can_access_system: status.onboarding.can_access_system
      };
    } catch (error) {
      logger.error('Error getting onboarding checklist:', error);
      throw error;
    }
  }
}

module.exports = new StudentOnboardingService();
