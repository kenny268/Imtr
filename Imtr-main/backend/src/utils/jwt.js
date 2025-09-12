const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const config = require('../config/env');

// JWT token expiration times
const TOKEN_EXPIRATION = {
  access: '15m',  // 15 minutes
  refresh: '7d'   // 7 days
};
const { logger } = require('../config/logger');

/**
 * Generate access token
 * @param {object} payload - Token payload
 * @returns {string} - Access token
 */
const generateAccessToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.accessExpiresIn,
      issuer: 'imtr-school-management',
      audience: 'imtr-users'
    });
  } catch (error) {
    logger.error('Error generating access token:', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Generate refresh token
 * @param {object} payload - Token payload
 * @returns {string} - Refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, config.jwt.refreshSecret, {
      expiresIn: config.jwt.refreshExpiresIn,
      issuer: 'imtr-school-management',
      audience: 'imtr-users'
    });
  } catch (error) {
    logger.error('Error generating refresh token:', error);
    throw new Error('Token generation failed');
  }
};

/**
 * Verify access token
 * @param {string} token - Access token
 * @returns {object} - Decoded token payload
 */
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, {
      issuer: 'imtr-school-management',
      audience: 'imtr-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Access token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid access token');
    } else {
      logger.error('Error verifying access token:', error);
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Verify refresh token
 * @param {string} token - Refresh token
 * @returns {object} - Decoded token payload
 */
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.refreshSecret, {
      issuer: 'imtr-school-management',
      audience: 'imtr-users'
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Refresh token expired');
    } else if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid refresh token');
    } else {
      logger.error('Error verifying refresh token:', error);
      throw new Error('Token verification failed');
    }
  }
};

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {object} - Decoded token payload
 */
const decodeToken = (token) => {
  try {
    return jwt.decode(token, { complete: true });
  } catch (error) {
    logger.error('Error decoding token:', error);
    throw new Error('Token decoding failed');
  }
};

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

/**
 * Get token expiration time
 * @param {string} token - JWT token
 * @returns {Date|null} - Token expiration date
 */
const getTokenExpiration = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return null;
    }
    
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

/**
 * Generate token pair (access + refresh)
 * @param {object} payload - Token payload
 * @returns {object} - Token pair
 */
const generateTokenPair = (payload) => {
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  
  return {
    accessToken,
    refreshToken,
    expiresIn: config.jwt.accessExpiresIn
  };
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - Refresh token
 * @returns {object} - New token pair
 */
const refreshAccessToken = (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    
    // Generate new token pair
    const newPayload = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role
    };
    
    return generateTokenPair(newPayload);
  } catch (error) {
    logger.error('Error refreshing access token:', error);
    throw error;
  }
};

/**
 * Blacklist token (for logout functionality)
 * @param {string} token - Token to blacklist
 * @param {number} expiresIn - Token expiration time in seconds
 */
const blacklistToken = (token, expiresIn) => {
  // TODO: Implement token blacklisting with Redis
  // For now, we rely on short token expiration times
  logger.info('Token blacklisted:', { token: token.substring(0, 20) + '...', expiresIn });
};

/**
 * Check if token is blacklisted
 * @param {string} token - Token to check
 * @returns {boolean} - True if token is blacklisted
 */
const isTokenBlacklisted = (token) => {
  // TODO: Implement token blacklist check with Redis
  return false;
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  decodeToken,
  isTokenExpired,
  getTokenExpiration,
  generateTokenPair,
  refreshAccessToken,
  blacklistToken,
  isTokenBlacklisted
};
