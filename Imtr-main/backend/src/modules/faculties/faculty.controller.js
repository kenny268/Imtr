const facultyService = require('./faculty.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class FacultyController {
  // Create faculty
  async createFaculty(req, res) {
    try {
      const faculty = await facultyService.createFaculty(req.body);
      sendSuccess(res, faculty, 'Faculty created successfully', 201);
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get all faculties
  async getFaculties(req, res) {
    try {
      const result = await facultyService.getFaculties(req.query);
      sendSuccess(res, result, 'Faculties retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get faculty by ID
  async getFacultyById(req, res) {
    try {
      const faculty = await facultyService.getFacultyById(req.params.id);
      sendSuccess(res, faculty, 'Faculty retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Update faculty
  async updateFaculty(req, res) {
    try {
      const faculty = await facultyService.updateFaculty(req.params.id, req.body);
      sendSuccess(res, faculty, 'Faculty updated successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Delete faculty
  async deleteFaculty(req, res) {
    try {
      const result = await facultyService.deleteFaculty(req.params.id);
      sendSuccess(res, result, 'Faculty deleted successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get faculty options
  async getFacultyOptions(req, res) {
    try {
      const faculties = await facultyService.getFacultyOptions();
      sendSuccess(res, faculties, 'Faculty options retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get faculty statistics
  async getFacultyStatistics(req, res) {
    try {
      const statistics = await facultyService.getFacultyStatistics();
      sendSuccess(res, statistics, 'Faculty statistics retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }
}

module.exports = new FacultyController();
