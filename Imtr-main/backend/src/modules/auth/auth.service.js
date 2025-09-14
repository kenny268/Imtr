const { User, Profile } = require('../../models');
const { hashPassword, comparePassword, generateRandomToken } = require('../../utils/crypto');
const { generateTokens } = require('../../middleware/auth');
const { logger } = require('../../config/logger');
const { AppError, ConflictError, NotFoundError, AuthenticationError } = require('../../middleware/errorHandler');

class AuthService {
  /**
   * Register a new user
   */
  async register(userData) {
    try {
      const { email, password, role, profile } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      // Check admin limit if trying to create admin account
      if (role === 'ADMIN') {
        const adminCount = await User.count({ where: { role: 'ADMIN' } });
        if (adminCount >= 2) {
          throw new ConflictError('Maximum number of admin accounts (2) has been reached');
        }
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Generate email verification token
      const emailVerificationToken = generateRandomToken(32);

      // Create user
      const user = await User.create({
        email: email.toLowerCase(),
        password_hash: hashedPassword,
        role: role || 'STUDENT',
        status: 'pending',
        email_verification_token: emailVerificationToken
      });

      // Create profile
      if (profile) {
        await Profile.create({
          user_id: user.id,
          ...profile
        });
      }

      // Get user with profile
      const userWithProfile = await User.findByPk(user.id, {
        include: ['profile'],
        attributes: { exclude: ['password_hash', 'email_verification_token'] }
      });

      // TODO: Send verification email
      logger.info('User registered successfully', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return userWithProfile;
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  /**
   * Login user
   */
  async login(email, password) {
    try {
      // Find user by email
      const user = await User.findOne({
        where: { email: email.toLowerCase() },
        include: ['profile']
      });

      if (!user) {
        throw new AuthenticationError('Invalid email or password');
      }

      // Check if user is active
      if (user.status !== 'active') {
        throw new AuthenticationError('Account is not active');
      }

      // Check if account is locked
      if (user.locked_until && user.locked_until > new Date()) {
        throw new AuthenticationError('Account is temporarily locked due to too many failed login attempts');
      }

      // Verify password
      const isPasswordValid = await comparePassword(password, user.password_hash);
      if (!isPasswordValid) {
        // Increment login attempts
        const attempts = user.login_attempts + 1;
        const maxAttempts = 5;
        const lockTime = 2 * 60 * 60 * 1000; // 2 hours

        if (attempts >= maxAttempts) {
          await user.update({
            login_attempts: attempts,
            locked_until: new Date(Date.now() + lockTime)
          });
          throw new AuthenticationError('Account locked due to too many failed attempts');
        } else {
          await user.update({ login_attempts: attempts });
          throw new AuthenticationError('Invalid email or password');
        }
      }

      // Reset login attempts and update last login
      await user.update({
        login_attempts: 0,
        locked_until: null,
        last_login_at: new Date()
      });

      // Generate tokens
      const tokens = generateTokens(user);

      // Remove sensitive data
      const userData = {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
        profile: user.profile
      };

      logger.info('User logged in successfully', {
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return { user: userData, tokens };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken) {
    try {
      const { verifyRefreshToken } = require('../../utils/jwt');
      const decoded = verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findByPk(decoded.userId, {
        include: ['profile']
      });

      if (!user || user.status !== 'active') {
        throw new AuthenticationError('Invalid refresh token');
      }

      // Generate new tokens
      const tokens = generateTokens(user);

      return tokens;
    } catch (error) {
      logger.error('Token refresh error:', error);
      throw new AuthenticationError('Invalid refresh token');
    }
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        // Don't reveal if user exists
        return { message: 'If an account with that email exists, a password reset link has been sent' };
      }

      // Generate reset token
      const resetToken = generateRandomToken(32);
      const resetExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

      await user.update({
        password_reset_token: resetToken,
        password_reset_expires: resetExpires
      });

      // TODO: Send email with reset link
      logger.info('Password reset token generated', {
        userId: user.id,
        email: user.email
      });

      return { message: 'If an account with that email exists, a password reset link has been sent' };
    } catch (error) {
      logger.error('Forgot password error:', error);
      throw error;
    }
  }

  /**
   * Reset password
   */
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        where: {
          password_reset_token: token,
          password_reset_expires: {
            [require('sequelize').Op.gt]: new Date()
          }
        }
      });

      if (!user) {
        throw new AppError('Invalid or expired reset token', 400);
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update user
      await user.update({
        password_hash: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
        login_attempts: 0,
        locked_until: null
      });

      logger.info('Password reset successfully', {
        userId: user.id,
        email: user.email
      });

      return { message: 'Password reset successful' };
    } catch (error) {
      logger.error('Reset password error:', error);
      throw error;
    }
  }

  /**
   * Change password
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(currentPassword, user.password_hash);
      if (!isCurrentPasswordValid) {
        throw new AuthenticationError('Current password is incorrect');
      }

      // Hash new password
      const hashedPassword = await hashPassword(newPassword);

      // Update password
      await user.update({
        password_hash: hashedPassword,
        login_attempts: 0,
        locked_until: null
      });

      logger.info('Password changed successfully', {
        userId: user.id,
        email: user.email
      });

      return { message: 'Password changed successfully' };
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  /**
   * Verify email
   */
  async verifyEmail(token) {
    try {
      const user = await User.findOne({
        where: { email_verification_token: token }
      });

      if (!user) {
        throw new AppError('Invalid verification token', 400);
      }

      // Update user status
      await user.update({
        email_verified: true,
        email_verification_token: null,
        status: 'active'
      });

      logger.info('Email verified successfully', {
        userId: user.id,
        email: user.email
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      logger.error('Email verification error:', error);
      throw error;
    }
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email) {
    try {
      const user = await User.findOne({
        where: { email: email.toLowerCase() }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      if (user.email_verified) {
        throw new AppError('Email already verified', 400);
      }

      // Generate new verification token
      const emailVerificationToken = generateRandomToken(32);

      await user.update({
        email_verification_token: emailVerificationToken
      });

      // TODO: Send verification email
      logger.info('Verification email resent', {
        userId: user.id,
        email: user.email
      });

      return { message: 'Verification email sent' };
    } catch (error) {
      logger.error('Resend verification email error:', error);
      throw error;
    }
  }

  /**
   * Get user profile
   */
  async getProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: ['profile'],
        attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires'] }
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      return user;
    } catch (error) {
      logger.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId, profileData) {
    try {
      const user = await User.findByPk(userId, {
        include: ['profile']
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // Update user data
      if (profileData.email && profileData.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: profileData.email.toLowerCase() }
        });
        if (existingUser) {
          throw new ConflictError('Email already in use');
        }
        await user.update({ email: profileData.email.toLowerCase() });
      }

      // Update profile data
      if (user.profile) {
        await user.profile.update(profileData);
      } else {
        await Profile.create({
          user_id: userId,
          ...profileData
        });
      }

      // Get updated user
      const updatedUser = await User.findByPk(userId, {
        include: ['profile'],
        attributes: { exclude: ['password_hash', 'password_reset_token', 'password_reset_expires'] }
      });

      logger.info('Profile updated successfully', {
        userId: userId
      });

      return updatedUser;
    } catch (error) {
      logger.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Logout user (invalidate tokens)
   */
  async logout(userId) {
    try {
      // TODO: Implement token blacklisting with Redis
      logger.info('User logged out', {
        userId: userId
      });

      return { message: 'Logout successful' };
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
