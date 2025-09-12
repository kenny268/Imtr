const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const config = require('../config/env');

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
const hashPassword = async (password) => {
  try {
    const saltRounds = config.security.bcryptRounds;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    throw new Error('Password hashing failed');
  }
};

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password
 * @returns {Promise<boolean>} - True if passwords match
 */
const comparePassword = async (password, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

/**
 * Generate a random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Random password
 */
const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return password;
};

/**
 * Generate a random token
 * @param {number} length - Token length (default: 32)
 * @returns {string} - Random token
 */
const generateRandomToken = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  
  for (let i = 0; i < length; i++) {
    token += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  
  return token;
};

/**
 * Generate a random numeric code
 * @param {number} length - Code length (default: 6)
 * @returns {string} - Random numeric code
 */
const generateNumericCode = (length = 6) => {
  let code = '';
  
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10);
  }
  
  return code;
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result
 */
const validatePasswordStrength = (password) => {
  const result = {
    isValid: true,
    errors: []
  };

  if (password.length < 8) {
    result.isValid = false;
    result.errors.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    result.isValid = false;
    result.errors.push('Password must be less than 128 characters');
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one number');
  }

  if (!/[@$!%*?&]/.test(password)) {
    result.isValid = false;
    result.errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  // Check for common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    result.isValid = false;
    result.errors.push('Password is too common, please choose a stronger password');
  }

  return result;
};

/**
 * Encrypt sensitive data (for future use with AES encryption)
 * @param {string} data - Data to encrypt
 * @returns {string} - Encrypted data
 */
const encryptData = (data) => {
  // TODO: Implement AES encryption for sensitive data
  // For now, return base64 encoded data
  return Buffer.from(data).toString('base64');
};

/**
 * Decrypt sensitive data (for future use with AES encryption)
 * @param {string} encryptedData - Encrypted data
 * @returns {string} - Decrypted data
 */
const decryptData = (encryptedData) => {
  // TODO: Implement AES decryption for sensitive data
  // For now, return base64 decoded data
  return Buffer.from(encryptedData, 'base64').toString('utf-8');
};

module.exports = {
  hashPassword,
  comparePassword,
  generateRandomPassword,
  generateRandomToken,
  generateNumericCode,
  validatePasswordStrength,
  encryptData,
  decryptData
};
