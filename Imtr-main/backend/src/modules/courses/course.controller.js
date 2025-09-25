const courseService = require('./course.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class CourseController {
  // Create a new course
  async createCourse(req, res) {
    try {
      const course = await courseService.createCourse(req.body);
      sendSuccess(res, course, 'Course created successfully', 201);
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get all courses
  async getCourses(req, res) {
    try {
      const result = await courseService.getCourses(req.query);
      sendSuccess(res, result, 'Courses retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get course by ID
  async getCourseById(req, res) {
    try {
      const course = await courseService.getCourseById(req.params.id);
      sendSuccess(res, course, 'Course retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Update course
  async updateCourse(req, res) {
    try {
      const course = await courseService.updateCourse(req.params.id, req.body);
      sendSuccess(res, course, 'Course updated successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Delete course
  async deleteCourse(req, res) {
    try {
      const result = await courseService.deleteCourse(req.params.id);
      sendSuccess(res, result, 'Course deleted successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get course statistics
  async getCourseStatistics(req, res) {
    try {
      const statistics = await courseService.getCourseStatistics();
      sendSuccess(res, statistics, 'Course statistics retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get course options
  async getCourseOptions(req, res) {
    try {
      const programId = req.query.program_id;
      const options = await courseService.getCourseOptions(programId);
      sendSuccess(res, options, 'Course options retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get courses by program
  async getCoursesByProgram(req, res) {
    try {
      const courses = await courseService.getCoursesByProgram(req.params.programId);
      sendSuccess(res, courses, 'Courses retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get class sections
  async getClassSections(req, res) {
    try {
      const result = await courseService.getClassSections(req.query);
      sendSuccess(res, result, 'Class sections retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = new CourseController();
