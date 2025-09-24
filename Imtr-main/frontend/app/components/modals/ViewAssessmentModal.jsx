'use client';

import { HiX, HiCalendar, HiClock, HiBookOpen, HiUsers, HiDocumentText, HiChartBar, HiAcademicCap } from 'react-icons/hi';

const ViewAssessmentModal = ({ isOpen, onClose, assessment }) => {
  if (!isOpen || !assessment) return null;

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
      case 'assignment': return <HiDocumentText className="h-5 w-5" />;
      case 'quiz': return <HiBookOpen className="h-5 w-5" />;
      case 'midterm': return <HiAcademicCap className="h-5 w-5" />;
      case 'final': return <HiAcademicCap className="h-5 w-5" />;
      case 'project': return <HiChartBar className="h-5 w-5" />;
      case 'presentation': return <HiUsers className="h-5 w-5" />;
      case 'lab': return <HiBookOpen className="h-5 w-5" />;
      default: return <HiDocumentText className="h-5 w-5" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              {getTypeIcon(assessment.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {assessment.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                {assessment.type} Assessment
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(assessment.status)}`}>
              {assessment.status}
            </span>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assessment Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assessment Type
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  {getTypeIcon(assessment.type)}
                  <span className="capitalize">{assessment.type}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Score
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiChartBar className="h-4 w-4" />
                  <span>{assessment.max_score} points</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Weight
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiChartBar className="h-4 w-4" />
                  <span>{assessment.weight}% of total grade</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Due Date
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiClock className="h-4 w-4" />
                  <span>{formatDate(assessment.due_date)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Course
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiBookOpen className="h-4 w-4" />
                  <span>{assessment.classSection?.course?.title || 'N/A'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Class Section
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiUsers className="h-4 w-4" />
                  <span>{assessment.classSection?.section_code || 'N/A'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiCalendar className="h-4 w-4" />
                  <span>{assessment.classSection?.academic_year || 'N/A'}</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Lecturer
                </label>
                <div className="flex items-center space-x-2 text-gray-900 dark:text-white">
                  <HiUsers className="h-4 w-4" />
                  <span>
                    {assessment.classSection?.lecturer?.user?.profile?.first_name} {assessment.classSection?.lecturer?.user?.profile?.last_name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          {assessment.instructions && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Instructions
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {assessment.instructions}
                </p>
              </div>
            </div>
          )}

          {/* Grades Summary */}
          {assessment.grades && assessment.grades.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Grades Summary
              </label>
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {assessment.grades.length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Total Grades
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round(assessment.grades.reduce((sum, grade) => sum + grade.score, 0) / assessment.grades.length)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Average Score
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.round((assessment.grades.filter(grade => grade.score >= assessment.max_score * 0.5).length / assessment.grades.length) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Pass Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Student Grades Table */}
          {assessment.grades && assessment.grades.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student Grades
              </label>
              <div className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Score
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Graded At
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {assessment.grades.map((grade) => (
                        <tr key={grade.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {grade.student?.user?.profile?.first_name} {grade.student?.user?.profile?.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {grade.student?.student_no}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {grade.score}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {grade.letter_grade || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(grade.graded_at)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Created/Updated Info */}
          <div className="pt-4 border-t border-gray-200 dark:border-dark-700">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-medium">Created:</span> {formatDate(assessment.created_at)}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {formatDate(assessment.updated_at)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAssessmentModal;
