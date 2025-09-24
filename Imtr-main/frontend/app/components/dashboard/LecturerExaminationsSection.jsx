'use client';

import { useState, useEffect } from 'react';
import { 
  HiClipboardList, 
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
  HiAcademicCap,
  HiDocumentText,
  HiChartBar,
  HiGrade
} from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const LecturerExaminationsSection = ({ 
  assessments,
  loading,
  pagination,
  assessmentFilters,
  assessmentViewMode,
  hasPermission, 
  setShowCreateAssessmentModal,
  setShowViewModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedAssessment,
  handleAssessmentFilterChange,
  refreshAssessments,
  fetchAssessments,
  setAssessmentViewMode
}) => {
  const { showError, showSuccess } = useUI();
  const [classSections, setClassSections] = useState([]);
  const [assessmentStats, setAssessmentStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    grading: 0,
    completed: 0
  });

  // Fetch class sections for filter dropdown
  const fetchClassSections = async () => {
    try {
      const response = await api.get('/courses/sections?limit=100');
      if (response.data.success) {
        setClassSections(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };

  // Fetch assessment statistics
  const fetchAssessmentStats = async () => {
    try {
      const response = await api.get('/assessments/statistics');
      if (response.data.success) {
        const stats = response.data.data;
        setAssessmentStats({
          total: stats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
          draft: stats.find(s => s.status === 'draft')?.count || 0,
          published: stats.find(s => s.status === 'published')?.count || 0,
          grading: stats.find(s => s.status === 'grading')?.count || 0,
          completed: stats.find(s => s.status === 'completed')?.count || 0
        });
      }
    } catch (error) {
      console.error('Error fetching assessment statistics:', error);
    }
  };

  useEffect(() => {
    fetchClassSections();
    fetchAssessmentStats();
  }, []);

  // Action handlers
  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleEditAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowEditModal(true);
  };

  const handleDeleteAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowDeleteModal(true);
  };

  const handlePublishAssessment = async (assessment) => {
    try {
      await api.patch(`/assessments/${assessment.id}/publish`);
      showSuccess('Assessment published successfully');
      refreshAssessments();
      fetchAssessmentStats();
    } catch (error) {
      console.error('Error publishing assessment:', error);
      showError('Failed to publish assessment');
    }
  };

  const handleGradeAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    // Navigate to grading interface
    window.location.href = `/assessments/${assessment.id}/grade`;
  };

  const handleFilterChange = (key, value) => {
    handleAssessmentFilterChange(key, value);
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'draft': return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
      case 'published': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400';
      case 'grading': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // Helper function to get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'assignment': return <HiDocumentText className="h-4 w-4" />;
      case 'quiz': return <HiClipboardList className="h-4 w-4" />;
      case 'midterm': return <HiBookOpen className="h-4 w-4" />;
      case 'final': return <HiAcademicCap className="h-4 w-4" />;
      case 'project': return <HiChartBar className="h-4 w-4" />;
      case 'presentation': return <HiUsers className="h-4 w-4" />;
      case 'lab': return <HiClipboardList className="h-4 w-4" />;
      default: return <HiDocumentText className="h-4 w-4" />;
    }
  };

  // Render assessment card
  const renderAssessmentCard = (assessment) => (
    <div key={assessment.id} className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
            {getTypeIcon(assessment.type)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {assessment.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
              {assessment.type} • {assessment.classSection?.course?.code}
            </p>
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
          {assessment.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiClock className="h-4 w-4 mr-2" />
          <span>Due: {formatDate(assessment.due_date)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiUsers className="h-4 w-4 mr-2" />
          <span>Max Score: {assessment.max_score}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <HiChartBar className="h-4 w-4 mr-2" />
          <span>Weight: {assessment.weight}%</span>
        </div>
        {assessment.classSection && (
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <HiBookOpen className="h-4 w-4 mr-2" />
            <span>{assessment.classSection.section_code} • {assessment.classSection.academic_year}</span>
          </div>
        )}
      </div>

      {assessment.instructions && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {assessment.instructions}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-dark-700">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewAssessment(assessment)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Assessment"
          >
            <HiEye className="h-4 w-4" />
          </button>
          {hasPermission('assessments:write') && (
            <button 
              onClick={() => handleEditAssessment(assessment)}
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              title="Edit Assessment"
            >
              <HiPencil className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:write') && assessment.status === 'draft' && (
            <button 
              onClick={() => handlePublishAssessment(assessment)}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              title="Publish Assessment"
            >
              <HiCheckCircle className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:grade') && (assessment.status === 'published' || assessment.status === 'grading') && (
            <button 
              onClick={() => handleGradeAssessment(assessment)}
              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
              title="Grade Assessment"
            >
              <HiGrade className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:delete') && assessment.status === 'draft' && (
            <button 
              onClick={() => handleDeleteAssessment(assessment)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Assessment"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {assessment.grades?.length || 0} grades
        </div>
      </div>
    </div>
  );

  // Render assessment table row
  const renderAssessmentRow = (assessment) => (
    <tr key={assessment.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg mr-3">
            {getTypeIcon(assessment.type)}
          </div>
          <div>
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {assessment.title}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {assessment.type}
            </div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {assessment.classSection?.course?.title || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {assessment.classSection?.section_code || 'N/A'}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {assessment.max_score}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {assessment.weight}%
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
        {formatDate(assessment.due_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(assessment.status)}`}>
          {assessment.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewAssessment(assessment)}
            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
            title="View Assessment"
          >
            <HiEye className="h-4 w-4" />
          </button>
          {hasPermission('assessments:write') && (
            <button 
              onClick={() => handleEditAssessment(assessment)}
              className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
              title="Edit Assessment"
            >
              <HiPencil className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:write') && assessment.status === 'draft' && (
            <button 
              onClick={() => handlePublishAssessment(assessment)}
              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
              title="Publish Assessment"
            >
              <HiCheckCircle className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:grade') && (assessment.status === 'published' || assessment.status === 'grading') && (
            <button 
              onClick={() => handleGradeAssessment(assessment)}
              className="text-purple-600 hover:text-purple-900 dark:text-purple-400 dark:hover:text-purple-300"
              title="Grade Assessment"
            >
              <HiGrade className="h-4 w-4" />
            </button>
          )}
          {hasPermission('assessments:delete') && assessment.status === 'draft' && (
            <button 
              onClick={() => handleDeleteAssessment(assessment)}
              className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              title="Delete Assessment"
            >
              <HiTrash className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Assessments</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your course assessments and examinations
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={refreshAssessments}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <HiRefresh className="h-5 w-5" />
            <span>Refresh</span>
          </button>
          {hasPermission('assessments:write') && (
            <button
              onClick={() => setShowCreateAssessmentModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
            >
              <HiPlus className="h-5 w-5" />
              <span>Create Assessment</span>
            </button>
          )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <HiClipboardList className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{assessmentStats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <HiDocumentText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Draft</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{assessmentStats.draft}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <HiCheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{assessmentStats.published}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <HiGrade className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Grading</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{assessmentStats.grading}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <HiCheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{assessmentStats.completed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assessments..."
                value={assessmentFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={assessmentFilters.type || ''}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="assignment">Assignment</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="project">Project</option>
              <option value="presentation">Presentation</option>
              <option value="lab">Lab</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status
            </label>
            <select
              value={assessmentFilters.status || ''}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="grading">Grading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Section
            </label>
            <select
              value={assessmentFilters.class_section_id || ''}
              onChange={(e) => handleFilterChange('class_section_id', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Sections</option>
              {classSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.section_code} - {section.course?.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAssessmentViewMode('grid')}
            className={`p-2 rounded-lg ${
              assessmentViewMode === 'grid'
                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <HiViewGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setAssessmentViewMode('list')}
            className={`p-2 rounded-lg ${
              assessmentViewMode === 'list'
                ? 'bg-brand-100 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
            }`}
          >
            <HiViewList className="h-5 w-5" />
          </button>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {pagination?.total || 0} assessments found
        </div>
      </div>

      {/* Assessments List */}
      {assessments && assessments.length > 0 ? (
        assessmentViewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map(renderAssessmentCard)}
          </div>
        ) : (
          <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Assessment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Section
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Max Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Weight
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Due Date
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
                  {assessments.map(renderAssessmentRow)}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12">
          <HiClipboardList className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assessments found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Get started by creating a new assessment.
          </p>
          {hasPermission('assessments:write') && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateAssessmentModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
              >
                <HiPlus className="h-4 w-4 mr-2" />
                Create Assessment
              </button>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fetchAssessments({ page: pagination.page - 1 })}
              disabled={pagination.page <= 1}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-dark-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              Previous
            </button>
            <button
              onClick={() => fetchAssessments({ page: pagination.page + 1 })}
              disabled={pagination.page >= pagination.pages}
              className="px-3 py-1 text-sm border border-gray-300 dark:border-dark-600 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LecturerExaminationsSection;
