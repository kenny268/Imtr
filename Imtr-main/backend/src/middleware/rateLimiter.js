const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const { logger } = require('../config/logger');

// General rate limiter
const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      url: req.url,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.'
    });
  }
});

// Strict rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      email: req.body?.email
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many authentication attempts, please try again later.'
    });
  }
});

// Password reset rate limiter
const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts per hour
  message: {
    success: false,
    message: 'Too many password reset attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Password reset rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      email: req.body?.email
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many password reset attempts, please try again later.'
    });
  }
});

// File upload rate limiter
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: {
    success: false,
    message: 'Too many file uploads, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Upload rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      userId: req.user?.id
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many file uploads, please try again later.'
    });
  }
});

// API rate limiter (more lenient for authenticated users)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: (req) => {
    // Authenticated users get higher limits
    return req.user ? 1000 : 200;
  },
  message: {
    success: false,
    message: 'API rate limit exceeded, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('API rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      userId: req.user?.id,
      url: req.url,
      method: req.method
    });
    
    res.status(429).json({
      success: false,
      message: 'API rate limit exceeded, please try again later.'
    });
  }
});

// M-Pesa payment rate limiter
const mpesaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // 3 payment attempts per window
  message: {
    success: false,
    message: 'Too many payment attempts, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('M-Pesa rate limit exceeded', {
      requestId: req.requestId,
      ip: req.ip,
      userId: req.user?.id,
      invoiceId: req.body?.invoiceId
    });
    
    res.status(429).json({
      success: false,
      message: 'Too many payment attempts, please try again later.'
    });
  }
});

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  apiLimiter,
  mpesaLimiter
};
