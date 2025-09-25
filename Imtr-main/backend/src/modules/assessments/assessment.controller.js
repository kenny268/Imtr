const assessmentService = require('./assessment.service');
const { sendSuccess, sendError } = require('../../utils/responses');
const { logger } = require('../../config/logger');

// Create a new assessment
const createAssessment = async (req, res) => {
  try {
    const assessmentData = {
      ...req.body,
      lecturer_id: req.user.id // Use authenticated user's ID
    };

    const assessment = await assessmentService.createAssessment(assessmentData, req.user.id);
    
    logger.info(`Assessment created: ${assessment.id} by user ${req.user.id}`);
    sendSuccess(res, assessment, 'Assessment created successfully', 201);
  } catch (error) {
    logger.error('Error creating assessment:', error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Get all assessments
const getAssessments = async (req, res) => {
  try {
    const result = await assessmentService.getAssessments(req.query);
    sendSuccess(res, result, 'Assessments retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving assessments:', error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Get assessment by ID
const getAssessmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.getAssessmentById(id);
    sendSuccess(res, assessment, 'Assessment retrieved successfully');
  } catch (error) {
    logger.error(`Error retrieving assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Update assessment
const updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.updateAssessment(id, req.body, req.user.id);
    
    logger.info(`Assessment updated: ${id} by user ${req.user.id}`);
    sendSuccess(res, assessment, 'Assessment updated successfully');
  } catch (error) {
    logger.error(`Error updating assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Delete assessment
const deleteAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assessmentService.deleteAssessment(id, req.user.id);
    
    logger.info(`Assessment deleted: ${id} by user ${req.user.id}`);
    sendSuccess(res, result, 'Assessment deleted successfully');
  } catch (error) {
    logger.error(`Error deleting assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Publish assessment
const publishAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.publishAssessment(id, req.body, req.user.id);
    
    logger.info(`Assessment published: ${id} by user ${req.user.id}`);
    sendSuccess(res, assessment, 'Assessment published successfully');
  } catch (error) {
    logger.error(`Error publishing assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Grade assessment
const gradeAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const assessment = await assessmentService.gradeAssessment(id, req.body, req.user.id);
    
    logger.info(`Assessment graded: ${id} by user ${req.user.id}`);
    sendSuccess(res, assessment, 'Grade recorded successfully');
  } catch (error) {
    logger.error(`Error grading assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Get student grades for an assessment
const getStudentGrades = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await assessmentService.getStudentGrades(id);
    sendSuccess(res, result, 'Student grades retrieved successfully');
  } catch (error) {
    logger.error(`Error retrieving grades for assessment ${req.params.id}:`, error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Get assessment statistics
const getAssessmentStatistics = async (req, res) => {
  try {
    const stats = await assessmentService.getAssessmentStatistics(req.query);
    sendSuccess(res, stats, 'Assessment statistics retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving assessment statistics:', error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

// Get assessment options
const getAssessmentOptions = async (req, res) => {
  try {
    const options = await assessmentService.getAssessmentOptions();
    sendSuccess(res, options, 'Assessment options retrieved successfully');
  } catch (error) {
    logger.error('Error retrieving assessment options:', error);
    sendError(res, error.message, error.statusCode || 500, error.errors);
  }
};

module.exports = {
  createAssessment,
  getAssessments,
  getAssessmentById,
  updateAssessment,
  deleteAssessment,
  publishAssessment,
  gradeAssessment,
  getStudentGrades,
  getAssessmentStatistics,
  getAssessmentOptions
};
