'use client';

import { useState, useEffect } from 'react';
import { 
  HiClipboardList, 
  HiEye, 
  HiSearch, 
  HiViewGrid, 
  HiViewList, 
  HiFilter,
  HiBookOpen,
  HiUsers,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiAcademicCap,
  HiDocumentText,
  HiChartBar,
  HiGrade,
  HiDownload
} from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const StudentExaminationsSection = ({ 
  assessments,
  loading,
  pagination,
  assessmentFilters,
  assessmentViewMode,
  hasPermission, 
  setShowViewModal,
  setSelectedAssessment,
  handleAssessmentFilterChange,
  refreshAssessments,
  fetchAssessments,
  setAssessmentViewMode
}) => {
  const { showError, showSuccess } = useUI();
  const [classSections, setClassSections] = useState([]);
  const [myGrades, setMyGrades] = useState([]);

  // Fetch class sections for filter dropdown
  const fetchClassSections = async () => {
    try {
      const response = await api.get('/courses/sections?limit=100');
      if (response.data.success) {
        setClassSections(response.data.data.class_sections || []);
      }
    } catch (error) {
      console.error('Error fetching class sections:', error);
    }
  };

  // Fetch my grades
  const fetchMyGrades = async () => {
    try {
      const response = await api.get('/students/my-grades');
      if (response.data.success) {
        setMyGrades(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching my grades:', error);
    }
  };

  useEffect(() => {
    fetchClassSections();
    fetchMyGrades();
  }, []);

  // Action handlers
  const handleViewAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    setShowViewModal(true);
  };

  const handleDownloadAssessment = (assessment) => {
    // Implement assessment download
    showSuccess('Assessment downloaded successfully');
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

  // Get my grade for an assessment
  const getMyGrade = (assessmentId) => {
    return myGrades.find(grade => grade.assessment_id === assessmentId);
  };

  // Render assessment card
  const renderAssessmentCard = (assessment) => {
    const myGrade = getMyGrade(assessment.id);
    
    return (
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

        {/* My Grade Display */}
        {myGrade && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HiGrade className="h-4 w-4 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">My Grade:</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-lg font-bold text-green-800 dark:text-green-200">
                  {myGrade.score}/{assessment.max_score}
                </span>
                {myGrade.letter_grade && (
                  <span className="text-lg font-bold text-green-800 dark:text-green-200">
                    ({myGrade.letter_grade})
                  </span>
                )}
              </div>
            </div>
            {myGrade.comments && (
              <p className="text-sm text-green-700 dark:text-green-300 mt-2">
                {myGrade.comments}
              </p>
            )}
          </div>
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
            {assessment.status === 'published' && (
              <button 
                onClick={() => handleDownloadAssessment(assessment)}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                title="Download Assessment"
              >
                <HiDownload className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {myGrade ? 'Graded' : 'Not graded'}
          </div>
        </div>
      </div>
    );
  };

  // Render assessment table row
  const renderAssessmentRow = (assessment) => {
    const myGrade = getMyGrade(assessment.id);
    
    return (
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
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
          {myGrade ? (
            <div className="flex items-center space-x-2">
              <span className="font-medium">{myGrade.score}/{assessment.max_score}</span>
              {myGrade.letter_grade && (
                <span className="text-green-600 dark:text-green-400">({myGrade.letter_grade})</span>
              )}
            </div>
          ) : (
            <span className="text-gray-500 dark:text-gray-400">Not graded</span>
          )}
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
            {assessment.status === 'published' && (
              <button 
                onClick={() => handleDownloadAssessment(assessment)}
                className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                title="Download Assessment"
              >
                <HiDownload className="h-4 w-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

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
            View your course assessments and grades
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={refreshAssessments}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
          >
            <HiClock className="h-5 w-5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* My Grades Summary */}
      {myGrades.length > 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-sm border border-gray-200 dark:border-dark-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Grades Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {myGrades.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Assessments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {myGrades.filter(g => g.score && g.score > 0).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Graded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {myGrades.filter(g => g.score && g.score > 0).length > 0 
                  ? Math.round(myGrades.filter(g => g.score && g.score > 0).reduce((sum, g) => sum + g.score, 0) / myGrades.filter(g => g.score && g.score > 0).length)
                  : 0
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {myGrades.filter(g => g.letter_grade && ['A', 'B', 'C'].includes(g.letter_grade)).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
            </div>
          </div>
        </div>
      )}

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
                      My Grade
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
            You don't have any assessments yet.
          </p>
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

export default StudentExaminationsSection;
