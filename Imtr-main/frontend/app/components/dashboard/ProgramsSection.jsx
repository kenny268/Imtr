import { useState, useEffect } from 'react';
import { 
  HiBookOpen, 
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
  HiAcademicCap,
  HiUsers,
  HiClock,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const ProgramsSection = ({ 
  hasPermission, 
  setShowCreateProgramModal,
  setShowViewModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedProgram
}) => {
  const { showError, showSuccess } = useUI();
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
    level: '',
    status: '',
    department: '',
    faculty: '',
    sortBy: 'created_at',
    sortOrder: 'DESC'
  });
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'

  // Fetch programs
  const fetchPrograms = async (page = 1, newFilters = filters) => {
    if (!hasPermission('programs:read')) return;
    
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(newFilters.search && { search: newFilters.search }),
        ...(newFilters.level && { level: newFilters.level }),
        ...(newFilters.status && { status: newFilters.status }),
        ...(newFilters.department && { department: newFilters.department }),
        ...(newFilters.faculty && { faculty: newFilters.faculty }),
        sortBy: newFilters.sortBy,
        sortOrder: newFilters.sortOrder
      });

      const response = await api.get(`/programs?${queryParams}`);
      if (response.data.success) {
        setPrograms(response.data.data.programs || []);
        setPagination(response.data.data.pagination || pagination);
      }
    } catch (error) {
      console.error('Failed to fetch programs:', error);
      showError('Failed to fetch programs');
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchPrograms(1, newFilters);
  };

  // Refresh programs
  const refreshPrograms = () => {
    fetchPrograms(pagination.current_page, filters);
  };

  // Action handlers
  const handleViewProgram = (program) => {
    setSelectedProgram(program);
    setShowViewModal(true);
  };

  const handleEditProgram = (program) => {
    setSelectedProgram(program);
    setShowEditModal(true);
  };

  const handleDeleteProgram = (program) => {
    setSelectedProgram(program);
    setShowDeleteModal(true);
  };

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'inactive': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      case 'suspended': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'archived': return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'certificate': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'diploma': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'bachelor': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'master': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'phd': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'postdoc': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount || 0);
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Programs</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage academic programs and their details</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshPrograms}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Refresh"
          >
            <HiRefresh className="h-5 w-5" />
          </button>
          {hasPermission('programs:write') && (
            <button
              onClick={() => setShowCreateProgramModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add Program</span>
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
                placeholder="Search programs..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center space-x-4">
            {/* Level Filter */}
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Levels</option>
              <option value="certificate">Certificate</option>
              <option value="diploma">Diploma</option>
              <option value="bachelor">Bachelor</option>
              <option value="master">Master</option>
              <option value="phd">PhD</option>
              <option value="postdoc">Postdoc</option>
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
              <option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </select>

            {/* Sort By */}
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="created_at">Created Date</option>
              <option value="name">Name</option>
              <option value="code">Code</option>
              <option value="level">Level</option>
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

      {/* Programs List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
        </div>
      ) : programs.length === 0 ? (
        <div className="text-center py-12">
          <HiBookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No programs found</h3>
          <p className="text-gray-600 dark:text-gray-400">Get started by creating your first program.</p>
        </div>
      ) : viewMode === 'table' ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Students
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
                {programs.map((program) => (
                  <tr key={program.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                            <HiBookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {program.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {program.code} • {program.department || 'No Department'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(program.level)}`}>
                        {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {program.duration_months} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      <div className="flex items-center space-x-1">
                        <HiUsers className="h-4 w-4 text-gray-400" />
                        <span>{program.student_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                        {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewProgram(program)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          title="View Program"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        {hasPermission('programs:write') && (
                          <button 
                            onClick={() => handleEditProgram(program)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                            title="Edit Program"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('programs:delete') && (
                          <button 
                            onClick={() => handleDeleteProgram(program)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            title="Delete Program"
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
          {programs.map((program) => (
            <div key={program.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                  <HiBookOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {program.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {program.code}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Level</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLevelColor(program.level)}`}>
                    {program.level.charAt(0).toUpperCase() + program.level.slice(1)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Duration</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {program.duration_months} months
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Students</span>
                  <div className="flex items-center space-x-1">
                    <HiUsers className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-900 dark:text-white">
                      {program.student_count || 0}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                    {program.status.charAt(0).toUpperCase() + program.status.slice(1)}
                  </span>
                </div>

                {program.tuition_fee > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tuition</span>
                    <span className="text-sm text-gray-900 dark:text-white">
                      {formatCurrency(program.tuition_fee)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleViewProgram(program)}
                    className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <HiEye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  {hasPermission('programs:write') && (
                    <button 
                      onClick={() => handleEditProgram(program)}
                      className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <HiPencil className="h-4 w-4" />
                      <span>Edit</span>
                    </button>
                  )}
                  {hasPermission('programs:delete') && (
                    <button 
                      onClick={() => handleDeleteProgram(program)}
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
                onClick={() => fetchPrograms(pagination.current_page - 1)}
                disabled={pagination.current_page === 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <button
                onClick={() => fetchPrograms(pagination.current_page + 1)}
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

export default ProgramsSection;
