/**
 * Standard API response utilities
 */

/**
 * Send success response
 * @param {object} res - Express response object
 * @param {*} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @param {object} meta - Additional metadata
 */
const sendSuccess = (res, data = null, message = 'Success', statusCode = 200, meta = {}) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(Object.keys(meta).length > 0 && { meta }),
    timestamp: new Date().toISOString(),
    requestId: res.get('X-Request-ID')
  };

  return res.status(statusCode).json(response);
};

/**
 * Send error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {*} errors - Error details
 * @param {object} meta - Additional metadata
 */
const sendError = (res, message = 'Error', statusCode = 500, errors = null, meta = {}) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors }),
    ...(Object.keys(meta).length > 0 && { meta }),
    timestamp: new Date().toISOString(),
    requestId: res.get('X-Request-ID')
  };

  return res.status(statusCode).json(response);
};

/**
 * Send paginated response
 * @param {object} res - Express response object
 * @param {Array} data - Array of data items
 * @param {object} pagination - Pagination information
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
const sendPaginated = (res, data, pagination, message = 'Success', statusCode = 200) => {
  const response = {
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNext: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrev: pagination.page > 1
    },
    timestamp: new Date().toISOString(),
    requestId: res.get('X-Request-ID')
  };

  // Set pagination headers
  res.set({
    'X-Total-Count': pagination.total,
    'X-Page-Count': Math.ceil(pagination.total / pagination.limit),
    'X-Current-Page': pagination.page,
    'X-Per-Page': pagination.limit
  });

  return res.status(statusCode).json(response);
};

/**
 * Send created response
 * @param {object} res - Express response object
 * @param {*} data - Created resource data
 * @param {string} message - Success message
 */
const sendCreated = (res, data, message = 'Resource created successfully') => {
  return sendSuccess(res, data, message, 201);
};

/**
 * Send no content response
 * @param {object} res - Express response object
 * @param {string} message - Success message
 */
const sendNoContent = (res, message = 'No content') => {
  return sendSuccess(res, null, message, 204);
};

/**
 * Send bad request response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Validation errors
 */
const sendBadRequest = (res, message = 'Bad request', errors = null) => {
  return sendError(res, message, 400, errors);
};

/**
 * Send unauthorized response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendUnauthorized = (res, message = 'Unauthorized') => {
  return sendError(res, message, 401);
};

/**
 * Send forbidden response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendForbidden = (res, message = 'Forbidden') => {
  return sendError(res, message, 403);
};

/**
 * Send not found response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendNotFound = (res, message = 'Resource not found') => {
  return sendError(res, message, 404);
};

/**
 * Send conflict response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendConflict = (res, message = 'Resource already exists') => {
  return sendError(res, message, 409);
};

/**
 * Send unprocessable entity response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {*} errors - Validation errors
 */
const sendUnprocessableEntity = (res, message = 'Unprocessable entity', errors = null) => {
  return sendError(res, message, 422, errors);
};

/**
 * Send too many requests response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendTooManyRequests = (res, message = 'Too many requests') => {
  return sendError(res, message, 429);
};

/**
 * Send internal server error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendInternalServerError = (res, message = 'Internal server error') => {
  return sendError(res, message, 500);
};

/**
 * Send service unavailable response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 */
const sendServiceUnavailable = (res, message = 'Service unavailable') => {
  return sendError(res, message, 503);
};

/**
 * Format validation errors
 * @param {Array} errors - Array of validation errors
 * @returns {Array} - Formatted error array
 */
const formatValidationErrors = (errors) => {
  return errors.map(error => ({
    field: error.field || error.path,
    message: error.message,
    value: error.value
  }));
};

/**
 * Create pagination object
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @returns {object} - Pagination object
 */
const createPagination = (page, limit, total) => {
  return {
    page: parseInt(page),
    limit: parseInt(limit),
    total: parseInt(total),
    offset: (parseInt(page) - 1) * parseInt(limit)
  };
};

/**
 * Format success message with count
 * @param {string} resource - Resource name
 * @param {number} count - Number of resources
 * @param {string} action - Action performed
 * @returns {string} - Formatted message
 */
const formatSuccessMessage = (resource, count = 1, action = 'retrieved') => {
  const resourceName = count === 1 ? resource : `${resource}s`;
  return `${count} ${resourceName} ${action} successfully`;
};

/**
 * Format error message with context
 * @param {string} resource - Resource name
 * @param {string} action - Action attempted
 * @param {string} reason - Reason for failure
 * @returns {string} - Formatted error message
 */
const formatErrorMessage = (resource, action, reason = 'failed') => {
  return `${resource} ${action} ${reason}`;
};

module.exports = {
  sendSuccess,
  sendError,
  sendPaginated,
  sendCreated,
  sendNoContent,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendUnprocessableEntity,
  sendTooManyRequests,
  sendInternalServerError,
  sendServiceUnavailable,
  formatValidationErrors,
  createPagination,
  formatSuccessMessage,
  formatErrorMessage
};
