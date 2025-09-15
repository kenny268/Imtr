const departmentService = require('./department.service');
const { sendSuccess, sendError } = require('../../utils/responses');

class DepartmentController {
  // Create department
  async createDepartment(req, res) {
    try {
      const department = await departmentService.createDepartment(req.body);
      sendSuccess(res, department, 'Department created successfully', 201);
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get all departments
  async getDepartments(req, res) {
    try {
      const result = await departmentService.getDepartments(req.query);
      sendSuccess(res, result, 'Departments retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get departments by faculty
  async getDepartmentsByFaculty(req, res) {
    try {
      const departments = await departmentService.getDepartmentsByFaculty(req.params.facultyId);
      sendSuccess(res, departments, 'Departments retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get department by ID
  async getDepartmentById(req, res) {
    try {
      const department = await departmentService.getDepartmentById(req.params.id);
      sendSuccess(res, department, 'Department retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Update department
  async updateDepartment(req, res) {
    try {
      const department = await departmentService.updateDepartment(req.params.id, req.body);
      sendSuccess(res, department, 'Department updated successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Delete department
  async deleteDepartment(req, res) {
    try {
      const result = await departmentService.deleteDepartment(req.params.id);
      sendSuccess(res, result, 'Department deleted successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get department options
  async getDepartmentOptions(req, res) {
    try {
      const facultyId = req.query.faculty_id || null;
      const departments = await departmentService.getDepartmentOptions(facultyId);
      sendSuccess(res, departments, 'Department options retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }

  // Get department statistics
  async getDepartmentStatistics(req, res) {
    try {
      const statistics = await departmentService.getDepartmentStatistics();
      sendSuccess(res, statistics, 'Department statistics retrieved successfully');
    } catch (error) {
      sendError(res, error.message, error.statusCode || 500, error.errors);
    }
  }
}

module.exports = new DepartmentController();
