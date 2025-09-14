'use client';

import { useState } from 'react';
import { 
  HiUser,
  HiAcademicCap, 
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiRefresh,
  HiSearch,
  HiViewGrid,
  HiViewList
} from 'react-icons/hi';

const StudentsSection = ({ 
  students, 
  loading, 
  pagination, 
  studentFilters, 
  studentViewMode, 
  hasPermission, 
  setShowCreateUserModal, 
  handleStudentFilterChange, 
  refreshStudents, 
  fetchStudents 
}) => {
  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Management</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshStudents}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh"
          >
            <HiRefresh className="h-5 w-5" />
          </button>
          {hasPermission('students:write') && (
            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors flex items-center space-x-2"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add Student</span>
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={studentFilters.search}
                onChange={(e) => handleStudentFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={studentFilters.year}
              onChange={(e) => handleStudentFilterChange('year', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Years</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>

            <select
              value={studentFilters.program}
              onChange={(e) => handleStudentFilterChange('program', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Programs</option>
              <option value="1">Meteorology</option>
              <option value="2">Climate Science</option>
            </select>

            <select
              value={studentFilters.status}
              onChange={(e) => handleStudentFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="graduated">Graduated</option>
              <option value="suspended">Suspended</option>
              <option value="withdrawn">Withdrawn</option>
            </select>

            <select
              value={`${studentFilters.sortBy}-${studentFilters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleStudentFilterChange('sortBy', sortBy);
                handleStudentFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="enrollment_year-desc">Year Desc</option>
              <option value="enrollment_year-asc">Year Asc</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg">
            <button
              onClick={() => setStudentViewMode('table')}
              className={`p-2 ${studentViewMode === 'table' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <HiViewList className="h-5 w-5" />
            </button>
            <button
              onClick={() => setStudentViewMode('grid')}
              className={`p-2 ${studentViewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <HiViewGrid className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Students Content */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading students...</p>
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center">
            <HiAcademicCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No students found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding a new student.</p>
            {hasPermission('students:write') && (
              <button 
                onClick={() => setShowCreateUserModal(true)}
                className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
              >
                Add First Student
              </button>
            )}
          </div>
        ) : studentViewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Student No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                            <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.profile?.first_name} {student.profile?.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.profile?.program || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                        student.status === 'graduated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                        student.status === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {student.created_at ? new Date(student.created_at).getFullYear() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <HiEye className="h-4 w-4" />
                        </button>
                        {hasPermission('students:write') && (
                          <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('students:delete') && (
                          <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                            <HiTrash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                    <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {student.profile?.first_name} {student.profile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {student.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Program:</span> {student.profile?.program || 'N/A'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Year:</span> {student.created_at ? new Date(student.created_at).getFullYear() : 'N/A'}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      student.status === 'graduated' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                      student.status === 'suspended' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                    }`}>
                      {student.status}
                    </span>
                    <div className="flex space-x-1">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        <HiEye className="h-4 w-4" />
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300">
                        <HiPencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
                {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{' '}
                {pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchStudents(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchStudents(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.total_pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentsSection;
