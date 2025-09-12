const { logger } = require('../config/logger');
const config = require('../config/env');

// Custom error classes
class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
  }
}

class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, 404);
  }
}

class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(message, 409);
  }
}

class PaymentError extends AppError {
  constructor(message = 'Payment processing failed') {
    super(message, 402);
  }
}

// Handle different types of errors
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new ValidationError(message);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new ConflictError(message);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));
  const message = 'Invalid input data';
  return new ValidationError(message, errors);
};

const handleJWTError = () => {
  return new AuthenticationError('Invalid token. Please log in again!');
};

const handleJWTExpiredError = () => {
  return new AuthenticationError('Your token has expired! Please log in again.');
};

const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map(el => ({
    field: el.path,
    message: el.message,
    value: el.value
  }));
  const message = 'Validation failed';
  return new ValidationError(message, errors);
};

const handleSequelizeUniqueConstraintError = (err) => {
  const field = err.errors[0].path;
  const message = `${field} already exists`;
  return new ConflictError(message);
};

const handleSequelizeForeignKeyConstraintError = (err) => {
  const message = 'Referenced resource does not exist';
  return new ValidationError(message);
};

// Send error response for development
const sendErrorDev = (err, req, res) => {
  logger.error('Error in development:', {
    requestId: req.requestId,
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query
  });

  return res.status(err.statusCode).json({
    success: false,
    error: err,
    message: err.message,
    stack: err.stack,
    requestId: req.requestId
  });
};

// Send error response for production
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    logger.error('Operational error:', {
      requestId: req.requestId,
      error: err.message,
      statusCode: err.statusCode,
      url: req.url,
      method: req.method
    });

    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.errors && { errors: err.errors }),
      requestId: req.requestId
    });
  }

  // Programming or other unknown error: don't leak error details
  logger.error('Programming error:', {
    requestId: req.requestId,
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method
  });

  return res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    requestId: req.requestId
  });
};

// Global error handling middleware
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  let error = { ...err };
  error.message = err.message;

  // Handle specific error types
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  if (err.name === 'JsonWebTokenError') error = handleJWTError();
  if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  
  // Sequelize errors
  if (err.name === 'SequelizeValidationError') error = handleSequelizeValidationError(err);
  if (err.name === 'SequelizeUniqueConstraintError') error = handleSequelizeUniqueConstraintError(err);
  if (err.name === 'SequelizeForeignKeyConstraintError') error = handleSequelizeForeignKeyConstraintError(err);

  if (config.nodeEnv === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

// Handle unhandled promise rejections
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err, promise) => {
    logger.error('Unhandled Promise Rejection:', {
      error: err,
      promise: promise
    });
    
    // Close server & exit process
    process.exit(1);
  });
};

// Handle uncaught exceptions
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', {
      error: err,
      stack: err.stack
    });
    
    process.exit(1);
  });
};

// 404 handler
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Not found - ${req.originalUrl}`);
  next(error);
};

// Async error wrapper
const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = {
  AppError,
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
  ConflictError,
  PaymentError,
  globalErrorHandler,
  handleUnhandledRejection,
  handleUncaughtException,
  notFoundHandler,
  asyncHandler
};