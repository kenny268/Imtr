import { useState, useEffect } from 'react';
import { 
  HiCollection, 
  HiPlus, 
  HiEye, 
  HiPencil, 
  HiTrash, 
  HiRefresh, 
  HiSearch, 
  HiViewGrid, 
  HiViewList, 
  HiFilter,
  HiChevronDown,
  HiBookOpen,
  HiUsers,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiAcademicCap
} from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const CoursesSection = ({ 
  hasPermission, 
  setShowCreateCourseModal,
  setShowViewModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedCourse
}) => {
  const { showError, showSuccess } = useUI();
  const [courses, setCourses] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 20,
    total: 0,
    total_pages: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    program_id: '',
    semester: '',
    year: '',
    course_type: '',
    status: '',
    is_offered: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Fetch programs for filter dropdown
  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs/options');
      if (response.data.success) {
        setPrograms(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async (page = 1, newFilters = filters) => {
    if (!hasPermission('courses:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(newFilters.search && { search: newFilters.search }),
        ...(newFilters.program_id && { program_id: newFilters.program_id }),
        ...(newFilters.semester && { semester: newFilters.semester }),
        ...(newFilters.year && { year: newFilters.year }),
        ...(newFilters.course_type && { course_type: newFilters.course_type }),
        ...(newFilters.status && { status: newFilters.status }),
        ...(newFilters.is_offered !== '' && { is_offered: newFilters.is_offered }),
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder
      });

      const response = await api.get(`/courses?${queryParams}`);
      if (response.data.success) {
        setCourses(response.data.data.courses || []);
        setPagination(response.data.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      showError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchCourses(1, newFilters);
  };

  // Refresh courses
  const refreshCourses = () => {
    fetchCourses(pagination.current_page, filters);
  };

  // Action handlers
  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowViewModal(true);
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setShowEditModal(true);
  };

  const handleDeleteCourse = (course) => {
    setSelectedCourse(course);
    setShowDeleteModal(true);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'archived': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'core': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'elective': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'prerequisite': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'general': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getProgramName = (course) => {
    return course.program?.name || 'Unknown Program';
  };

  useEffect(() => {
    fetchPrograms();
    fetchCourses();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage courses and their details</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshCourses}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <HiRefresh className="h-5 w-5" />
          </button>
          {hasPermission('courses:write') && (
            <button
              onClick={() => setShowCreateCourseModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add Course</span>
            </button>
          )}
        </div>
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
                placeholder="Search courses..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            {/* Program Filter */}
            <select
              value={filters.program_id}
              onChange={(e) => handleFilterChange('program_id', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Programs</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.code})
                </option>
              ))}
            </select>

            {/* Year Filter */}
            <select
              value={filters.year}
              onChange={(e) => handleFilterChange('year', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>

            {/* Semester Filter */}
            <select
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Semesters</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>

            {/* Course Type Filter */}
            <select
              value={filters.course_type}
              onChange={(e) => handleFilterChange('course_type', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="core">Core</option>
              <option value="elective">Elective</option>
              <option value="prerequisite">Prerequisite</option>
              <option value="general">General</option>
            </select>

            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>

            {/* Offered Filter */}
            <select
              value={filters.is_offered}
              onChange={(e) => handleFilterChange('is_offered', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Courses</option>
              <option value="true">Currently Offered</option>
              <option value="false">Not Offered</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="created_at">Created Date</option>
              <option value="title">Title</option>
              <option value="code">Code</option>
              <option value="credits">Credits</option>
              <option value="year">Year</option>
              <option value="semester">Semester</option>
              <option value="status">Status</option>
            </select>

            {/* Sort Order */}
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="DESC">Descending</option>
              <option value="ASC">Ascending</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg">
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 ${viewMode === 'table' ? 'bg-brand-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                title="Table View"
              >
                <HiViewList className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                title="Grid View"
              >
                <HiViewGrid className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Courses List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-12">
          <HiCollection className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No courses found</h3>
          <p className="text-gray-600 dark:text-gray-400">Get started by creating your first course.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Year/Sem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {courses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                            <HiCollection className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {course.code}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {getProgramName(course)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      Y{course.year} S{course.semester}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {course.credits}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(course.course_type)}`}>
                        {course.course_type.charAt(0).toUpperCase() + course.course_type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewCourse(course)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Course"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        {hasPermission('courses:write') && (
                          <button 
                            onClick={() => handleEditCourse(course)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit Course"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('courses:delete') && (
                          <button 
                            onClick={() => handleDeleteCourse(course)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Course"
                          >
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
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div key={course.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                  <HiCollection className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {course.code}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Program</span>
                  <span className="text-sm text-gray-900 dark:text-white truncate max-w-32">
                    {getProgramName(course)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Year/Semester</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    Y{course.year} S{course.semester}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Credits</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {course.credits}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Type</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(course.course_type)}`}>
                    {course.course_type.charAt(0).toUpperCase() + course.course_type.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(course.status)}`}>
                    {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                  </span>
                </div>

                {course.total_hours > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Hours</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {course.total_hours}h
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewCourse(course)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <HiEye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  {hasPermission('courses:write') && (
                    <button 
                      onClick={() => handleEditCourse(course)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <HiPencil className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {hasPermission('courses:delete') && (
                    <button 
                      onClick={() => handleDeleteCourse(course)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <HiTrash className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
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
                onClick={() => fetchCourses(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button
                onClick={() => fetchCourses(pagination.current_page + 1)}
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
  );
};

export default CoursesSection;
