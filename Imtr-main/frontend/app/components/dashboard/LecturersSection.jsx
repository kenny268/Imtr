'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiPlus, 
  HiSearch, 
  HiFilter, 
  HiViewGrid, 
  HiViewList,
  HiPencil,
  HiTrash,
  HiEye,
  HiUser,
  HiMail,
  HiPhone,
  HiAcademicCap,
  HiOfficeBuilding,
  HiCalendar,
  HiBadgeCheck
} from 'react-icons/hi';
import { useQuery } from '@tanstack/react-query';
import { useUI } from '@/app/contexts/UIContext';
import { useAuth } from '@/app/lib/auth-context';
import { api } from '@/app/lib/api';
import { formatDate, generateInitials } from '@/app/lib/utils';
import CreateLecturerModal from '@/app/components/modals/CreateLecturerModal';
import EditLecturerModal from '@/app/components/modals/EditLecturerModal';
import ViewLecturerModal from '@/app/components/modals/ViewLecturerModal';

const LecturersSection = () => {
  const { showError, showSuccess } = useUI();
  const { hasPermission, user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedLecturer, setSelectedLecturer] = useState(null);

  // Use React Query for data fetching
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['lecturers', currentPage, searchTerm, filterStatus],
    queryFn: async () => {
      console.log('Fetching lecturers...');
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchTerm && { search: searchTerm }),
        ...(filterStatus !== 'all' && { status: filterStatus })
      });

      console.log('API URL:', `/lecturers?${params}`);
      const response = await api.get(`/lecturers?${params}`);
      console.log('API Response:', response.data);
      return response.data.message; // The lecturers data is in response.data.message, not response.data.data
    },
    enabled: !!user, // Only fetch when user is authenticated
    keepPreviousData: true,
  });

  // Extract data with defensive programming
  console.log('Raw data from API:', data);
  const lecturers = Array.isArray(data?.lecturers) ? data.lecturers : [];
  const pagination = data?.pagination || { 
    total: 0, 
    pages: 1, 
    current_page: 1, 
    per_page: 20 
  };
  console.log('Extracted lecturers:', lecturers);
  console.log('Extracted pagination:', pagination);
  const loading = isLoading || !user; // Show loading while user is being fetched or data is loading

  // Debug logging
  console.log('LecturersSection - User:', user);
  console.log('LecturersSection - Has lecturers:read permission:', hasPermission('lecturers:read'));
  console.log('LecturersSection - Query enabled:', !!user);
  console.log('LecturersSection - Is loading:', isLoading);
  console.log('LecturersSection - Is error:', isError);

  // Handle errors
  useEffect(() => {
    if (isError) {
      showError(error?.response?.data?.message || 'Failed to fetch lecturers');
    }
  }, [isError, error, showError]);

  // Handle search and filter changes
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (e) => {
    setFilterStatus(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreateSuccess = () => {
    refetch();
  };

  const handleEditSuccess = () => {
    refetch();
  };

  const handleViewLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    setShowViewModal(true);
  };

  const handleEditLecturer = (lecturer) => {
    setSelectedLecturer(lecturer);
    setShowEditModal(true);
  };

  const handleDeleteLecturer = async (lecturer) => {
    if (window.confirm(`Are you sure you want to delete ${lecturer.user?.profile?.first_name} ${lecturer.user?.profile?.last_name}?`)) {
      try {
        await api.delete(`/lecturers/${lecturer.id}`);
        showSuccess('Lecturer deleted successfully');
        refetch();
      } catch (error) {
        console.error('Failed to delete lecturer:', error);
        showError(error.response?.data?.message || 'Failed to delete lecturer');
      }
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderPagination = () => {
    const { current_page, total_pages } = pagination;
    
    if (total_pages <= 1) return null;

    const pages = [];
    const startPage = Math.max(1, current_page - 2);
    const endPage = Math.min(total_pages, current_page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
            i === current_page
              ? 'bg-brand-500 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {((current_page - 1) * (pagination.per_page || 20)) + 1} to {Math.min(current_page * (pagination.per_page || 20), pagination.total || 0)} of {pagination.total || 0} lecturers
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(current_page - 1)}
            disabled={current_page <= 1}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {pages}
          <button
            onClick={() => handlePageChange(current_page + 1)}
            disabled={current_page >= total_pages}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  const renderLecturerCard = (lecturer) => (
    <motion.div
      key={lecturer.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
            <span className="text-brand-600 dark:text-brand-400 font-semibold text-lg">
              {generateInitials(`${lecturer.user?.profile?.first_name || ''} ${lecturer.user?.profile?.last_name || ''}`)}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.last_name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{lecturer.staff_no}</p>
          </div>
        </div>
        {getStatusBadge(lecturer.status)}
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <HiMail className="h-4 w-4" />
          <span>{lecturer.user?.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <HiPhone className="h-4 w-4" />
          <span>{lecturer.user?.profile?.phone || 'Not provided'}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <HiAcademicCap className="h-4 w-4" />
          <span>{lecturer.specialization}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
          <HiOfficeBuilding className="h-4 w-4" />
          <span>{lecturer.department?.name || 'Not assigned'}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-500">
          Joined {formatDate(lecturer.createdAt)}
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewLecturer(lecturer)}
            className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
          >
            <HiEye className="h-4 w-4" />
          </button>
          {hasPermission('lecturers:write') && (
            <button 
              onClick={() => handleEditLecturer(lecturer)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <HiPencil className="h-4 w-4" />
            </button>
          )}
          {hasPermission('lecturers:delete') && (
            <button 
              onClick={() => handleDeleteLecturer(lecturer)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderLecturerRow = (lecturer) => (
    <motion.tr
      key={lecturer.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
            <span className="text-brand-600 dark:text-brand-400 font-semibold text-sm">
              {generateInitials(`${lecturer.user?.profile?.first_name || ''} ${lecturer.user?.profile?.last_name || ''}`)}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.last_name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{lecturer.staff_no}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {lecturer.user?.email}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {lecturer.specialization}
      </td>
      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
        {lecturer.department?.name || 'Not assigned'}
      </td>
      <td className="px-6 py-4">
        {getStatusBadge(lecturer.status)}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {formatDate(lecturer.createdAt)}
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => handleViewLecturer(lecturer)}
            className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg transition-colors"
          >
            <HiEye className="h-4 w-4" />
          </button>
          {hasPermission('lecturers:write') && (
            <button 
              onClick={() => handleEditLecturer(lecturer)}
              className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
            >
              <HiPencil className="h-4 w-4" />
            </button>
          )}
          {hasPermission('lecturers:delete') && (
            <button 
              onClick={() => handleDeleteLecturer(lecturer)}
              className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </motion.tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturers</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage lecturers and their information</p>
        </div>
        {hasPermission('lecturers:write') && (
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <HiPlus className="h-5 w-5" />
            <span>Add Lecturer</span>
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search lecturers..."
                value={searchTerm}
                onChange={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterStatus}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <div className="flex items-center border border-gray-300 dark:border-dark-600 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <HiViewGrid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              >
                <HiViewList className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {lecturers.length === 0 ? (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-12 text-center">
          <HiUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No lecturers found</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first lecturer.</p>
          {hasPermission('lecturers:write') && (
            <button className="bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 mx-auto transition-colors">
              <HiPlus className="h-5 w-5" />
              <span>Add Lecturer</span>
            </button>
          )}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lecturers.map(renderLecturerCard)}
            </div>
          ) : (
            <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                  <thead className="bg-gray-50 dark:bg-dark-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Lecturer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                    {lecturers.map(renderLecturerRow)}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {renderPagination()}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateLecturerModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {showEditModal && selectedLecturer && (
        <EditLecturerModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          lecturer={selectedLecturer}
          onSuccess={handleEditSuccess}
        />
      )}

      {showViewModal && selectedLecturer && (
        <ViewLecturerModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          lecturer={selectedLecturer}
        />
      )}
    </div>
  );
};

export default LecturersSection;
