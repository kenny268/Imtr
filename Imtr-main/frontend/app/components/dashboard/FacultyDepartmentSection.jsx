'use client';

import React, { useState, useEffect } from 'react';
import { 
  HiPlus, 
  HiRefresh, 
  HiSearch, 
  HiViewGrid, 
  HiViewList,
  HiAcademicCap,
  HiOfficeBuilding,
  HiPencil,
  HiTrash,
  HiEye,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';

const FacultyDepartmentSection = ({
  activeTab,
  setActiveTab,
  faculties,
  departments,
  loading,
  facultyPagination,
  departmentPagination,
  facultyFilters,
  departmentFilters,
  facultyViewMode,
  departmentViewMode,
  hasPermission,
  setShowCreateFacultyModal,
  setShowCreateDepartmentModal,
  setShowViewModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedFaculty,
  setSelectedDepartment,
  handleFacultyFilterChange,
  handleDepartmentFilterChange,
  refreshFaculties,
  refreshDepartments,
  fetchFaculties,
  fetchDepartments,
  setFacultyViewMode,
  setDepartmentViewMode
}) => {
  const { showError } = useUI();

  const handleFacultyFilter = (key, value) => {
    handleFacultyFilterChange(key, value);
  };

  const handleDepartmentFilter = (key, value) => {
    handleDepartmentFilterChange(key, value);
  };

  const handleViewFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setShowViewModal(true);
  };

  const handleEditFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setShowEditModal(true);
  };

  const handleDeleteFaculty = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDeleteModal(true);
  };

  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
    setShowViewModal(true);
  };

  const handleEditDepartment = (department) => {
    setSelectedDepartment(department);
    setShowEditModal(true);
  };

  const handleDeleteDepartment = (department) => {
    setSelectedDepartment(department);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.inactive}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  const renderFacultyTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Faculty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Dean
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Departments
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-700">
          {faculties.map((faculty) => (
            <tr key={faculty.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                      <HiOfficeBuilding className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {faculty.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {faculty.location || 'No location specified'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {faculty.code}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {faculty.dean_name || 'Not assigned'}
                </div>
                {faculty.dean_email && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {faculty.dean_email}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900 dark:text-white">
                  {faculty.department_count || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(faculty.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {formatDate(faculty.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleViewFaculty(faculty)}
                    className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                    title="View Faculty"
                  >
                    <HiEye className="h-4 w-4" />
                  </button>
                  {hasPermission('faculties:write') && (
                    <>
                      <button
                        onClick={() => handleEditFaculty(faculty)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Faculty"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaculty(faculty)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Faculty"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderDepartmentTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
        <thead className="bg-gray-50 dark:bg-dark-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Faculty
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Head
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Programs
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-dark-900 divide-y divide-gray-200 dark:divide-dark-700">
          {departments.map((department) => (
            <tr key={department.id} className="hover:bg-gray-50 dark:hover:bg-dark-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                      <HiAcademicCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {department.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {department.location || 'No location specified'}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm font-mono text-gray-900 dark:text-white">
                  {department.code}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {department.faculty?.name || 'N/A'}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {department.faculty?.code || ''}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {department.head_name || 'Not assigned'}
                </div>
                {department.head_email && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {department.head_email}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="text-sm text-gray-900 dark:text-white">
                  {department.program_count || 0}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(department.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => handleViewDepartment(department)}
                    className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                    title="View Department"
                  >
                    <HiEye className="h-4 w-4" />
                  </button>
                  {hasPermission('departments:write') && (
                    <>
                      <button
                        onClick={() => handleEditDepartment(department)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        title="Edit Department"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        title="Delete Department"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderPagination = (pagination, onPageChange) => {
    if (pagination.total_pages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-700">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => onPageChange(pagination.current_page - 1)}
            disabled={pagination.current_page <= 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(pagination.current_page + 1)}
            disabled={pagination.current_page >= pagination.total_pages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing{' '}
              <span className="font-medium">
                {((pagination.current_page - 1) * pagination.per_page) + 1}
              </span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{pagination.total}</span>{' '}
              results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => onPageChange(pagination.current_page - 1)}
                disabled={pagination.current_page <= 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiChevronLeft className="h-5 w-5" />
              </button>
              {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      page === pagination.current_page
                        ? 'z-10 bg-brand-50 dark:bg-brand-900 border-brand-500 dark:border-brand-400 text-brand-600 dark:text-brand-400'
                        : 'bg-white dark:bg-dark-700 border-gray-300 dark:border-dark-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                onClick={() => onPageChange(pagination.current_page + 1)}
                disabled={pagination.current_page >= pagination.total_pages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiChevronRight className="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Faculty & Department Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage academic faculties and their departments
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={activeTab === 'faculties' ? refreshFaculties : refreshDepartments}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <HiRefresh className="h-5 w-5" />
          </button>
          {activeTab === 'faculties' && hasPermission('faculties:write') && (
            <button
              onClick={() => setShowCreateFacultyModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add Faculty</span>
            </button>
          )}
          {activeTab === 'departments' && hasPermission('departments:write') && (
            <button
              onClick={() => setShowCreateDepartmentModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add Department</span>
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-dark-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('faculties')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'faculties'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-dark-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <HiOfficeBuilding className="h-4 w-4" />
              <span>Faculties ({faculties.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'departments'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-dark-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <HiAcademicCap className="h-4 w-4" />
              <span>Departments ({departments.length})</span>
            </div>
          </button>
        </nav>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={activeTab === 'faculties' ? 'Search faculties...' : 'Search departments...'}
                value={activeTab === 'faculties' ? facultyFilters.search : departmentFilters.search}
                onChange={(e) => activeTab === 'faculties' ? handleFacultyFilter('search', e.target.value) : handleDepartmentFilter('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            {activeTab === 'departments' && (
              <select
                value={departmentFilters.faculty_id || ''}
                onChange={(e) => handleDepartmentFilter('faculty_id', e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">All Faculties</option>
                {/* This would be populated with faculty options */}
              </select>
            )}
            
            <select
              value={activeTab === 'faculties' ? facultyFilters.status : departmentFilters.status}
              onChange={(e) => activeTab === 'faculties' ? handleFacultyFilter('status', e.target.value) : handleDepartmentFilter('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>

            <select
              value={activeTab === 'faculties' ? facultyFilters.sortBy : departmentFilters.sortBy}
              onChange={(e) => activeTab === 'faculties' ? handleFacultyFilter('sortBy', e.target.value) : handleDepartmentFilter('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="created_at">Created Date</option>
              <option value="name">Name</option>
              <option value="code">Code</option>
              <option value="updated_at">Updated Date</option>
            </select>

            <select
              value={activeTab === 'faculties' ? facultyFilters.sortOrder : departmentFilters.sortOrder}
              onChange={(e) => activeTab === 'faculties' ? handleFacultyFilter('sortOrder', e.target.value) : handleDepartmentFilter('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 border border-gray-300 dark:border-dark-600 rounded-lg p-1">
              <button
                onClick={() => activeTab === 'faculties' ? setFacultyViewMode('table') : setDepartmentViewMode('table')}
                className={`p-2 rounded ${(activeTab === 'faculties' ? facultyViewMode : departmentViewMode) === 'table' 
                  ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Table View"
              >
                <HiViewList className="h-4 w-4" />
              </button>
              <button
                onClick={() => activeTab === 'faculties' ? setFacultyViewMode('grid') : setDepartmentViewMode('grid')}
                className={`p-2 rounded ${(activeTab === 'faculties' ? facultyViewMode : departmentViewMode) === 'grid' 
                  ? 'bg-brand-100 text-brand-600 dark:bg-brand-900 dark:text-brand-400' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
                title="Grid View"
              >
                <HiViewGrid className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
          </div>
        ) : (
          <>
            {activeTab === 'faculties' ? (
              <>
                {faculties.length === 0 ? (
                  <div className="text-center py-12">
                    <HiOfficeBuilding className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No faculties found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating your first faculty.
                    </p>
                  </div>
                ) : (
                  <>
                    {facultyViewMode === 'table' ? renderFacultyTable() : (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {faculties.map((faculty) => (
                            <div key={faculty.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
                                  <HiOfficeBuilding className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {faculty.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {faculty.code}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Dean:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {faculty.dean_name || 'Not assigned'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Departments:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {faculty.department_count || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                  {getStatusBadge(faculty.status)}
                                </div>
                              </div>
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleViewFaculty(faculty)}
                                  className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                                >
                                  <HiEye className="h-4 w-4" />
                                </button>
                                {hasPermission('faculties:write') && (
                                  <>
                                    <button
                                      onClick={() => handleEditFaculty(faculty)}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      <HiPencil className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteFaculty(faculty)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <HiTrash className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {renderPagination(facultyPagination, (page) => fetchFaculties(page, facultyFilters))}
                  </>
                )}
              </>
            ) : (
              <>
                {departments.length === 0 ? (
                  <div className="text-center py-12">
                    <HiAcademicCap className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No departments found</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Get started by creating your first department.
                    </p>
                  </div>
                ) : (
                  <>
                    {departmentViewMode === 'table' ? renderDepartmentTable() : (
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {departments.map((department) => (
                            <div key={department.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-6">
                              <div className="flex items-center space-x-3 mb-4">
                                <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                                  <HiAcademicCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    {department.name}
                                  </h3>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {department.code}
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2 mb-4">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Faculty:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {department.faculty?.name || 'N/A'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Head:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {department.head_name || 'Not assigned'}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Programs:</span>
                                  <span className="text-sm text-gray-900 dark:text-white">
                                    {department.program_count || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-500 dark:text-gray-400">Status:</span>
                                  {getStatusBadge(department.status)}
                                </div>
                              </div>
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleViewDepartment(department)}
                                  className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                                >
                                  <HiEye className="h-4 w-4" />
                                </button>
                                {hasPermission('departments:write') && (
                                  <>
                                    <button
                                      onClick={() => handleEditDepartment(department)}
                                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                    >
                                      <HiPencil className="h-4 w-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteDepartment(department)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      <HiTrash className="h-4 w-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {renderPagination(departmentPagination, (page) => fetchDepartments(page, departmentFilters))}
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FacultyDepartmentSection;
