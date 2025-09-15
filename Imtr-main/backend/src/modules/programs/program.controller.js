const programService = require('./program.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class ProgramController {
  // Create a new program
  async createProgram(req, res) {
    try {
      const program = await programService.createProgram(req.body);
      sendSuccess(res, program, 'Program created successfully', 201);
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get all programs
  async getPrograms(req, res) {
    try {
      const result = await programService.getPrograms(req.query);
      sendSuccess(res, result, 'Programs retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get program by ID
  async getProgramById(req, res) {
    try {
      const program = await programService.getProgramById(req.params.id);
      sendSuccess(res, program, 'Program retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Update program
  async updateProgram(req, res) {
    try {
      const program = await programService.updateProgram(req.params.id, req.body);
      sendSuccess(res, program, 'Program updated successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Delete program
  async deleteProgram(req, res) {
    try {
      const result = await programService.deleteProgram(req.params.id);
      sendSuccess(res, result, 'Program deleted successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get program statistics
  async getProgramStatistics(req, res) {
    try {
      const statistics = await programService.getProgramStatistics();
      sendSuccess(res, statistics, 'Program statistics retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }

  // Get program options
  async getProgramOptions(req, res) {
    try {
      const options = await programService.getProgramOptions();
      sendSuccess(res, options, 'Program options retrieved successfully');
    } catch (error) {
      sendError(res, error);
    }
  }
}

module.exports = new ProgramController();
