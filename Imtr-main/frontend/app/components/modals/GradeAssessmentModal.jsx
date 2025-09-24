'use client';

import { useState, useEffect } from 'react';
import { HiX, HiCheckCircle, HiXCircle, HiUsers, HiGrade, HiSave } from 'react-icons/hi';
import { api } from '@/app/lib/api';
import { useUI } from '@/app/contexts/UIContext';

const GradeAssessmentModal = ({ isOpen, onClose, assessment, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch student grades for this assessment
  useEffect(() => {
    if (isOpen && assessment) {
      fetchStudentGrades();
    }
  }, [isOpen, assessment]);

  const fetchStudentGrades = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/assessments/${assessment.id}/grades`);
      if (response.data.success) {
        setGrades(response.data.data.grades || []);
      }
    } catch (error) {
      console.error('Error fetching student grades:', error);
      showError('Failed to fetch student grades');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (studentId, field, value) => {
    setGrades(prev => prev.map(grade => 
      grade.student_id === studentId 
        ? { ...grade, [field]: value }
        : grade
    ));
  };

  const handleSaveGrade = async (studentId) => {
    try {
      const grade = grades.find(g => g.student_id === studentId);
      if (!grade) return;

      const gradeData = {
        student_id: studentId,
        score: parseFloat(grade.score) || 0,
        letter_grade: grade.letter_grade || '',
        comments: grade.comments || ''
      };

      await api.post(`/assessments/${assessment.id}/grades`, gradeData);
      showSuccess('Grade saved successfully');
      fetchStudentGrades();
    } catch (error) {
      console.error('Error saving grade:', error);
      showError('Failed to save grade');
    }
  };

  const handleSaveAllGrades = async () => {
    try {
      setIsSubmitting(true);
      
      for (const grade of grades) {
        if (grade.score !== undefined && grade.score !== '') {
          const gradeData = {
            student_id: grade.student_id,
            score: parseFloat(grade.score) || 0,
            letter_grade: grade.letter_grade || '',
            comments: grade.comments || ''
          };

          await api.post(`/assessments/${assessment.id}/grades`, gradeData);
        }
      }
      
      showSuccess('All grades saved successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving grades:', error);
      showError('Failed to save grades');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateLetterGrade = (score, maxScore) => {
    if (!score || !maxScore) return '';
    const percentage = (score / maxScore) * 100;
    
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <HiGrade className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Grade Assessment: {assessment.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {assessment.classSection?.course?.title} • {assessment.classSection?.section_code}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
            </div>
          ) : (
            <>
              {/* Assessment Info */}
              <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Max Score
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {assessment.max_score}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Weight
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {assessment.weight}%
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Due Date
                    </label>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {assessment.due_date ? new Date(assessment.due_date).toLocaleDateString() : 'Not set'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Student Grades Table */}
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
                          Letter Grade
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Comments
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                      {grades.map((grade) => (
                        <tr key={grade.student_id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                                  <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                                    {grade.student?.user?.profile?.first_name?.charAt(0)}{grade.student?.user?.profile?.last_name?.charAt(0)}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {grade.student?.user?.profile?.first_name} {grade.student?.user?.profile?.last_name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {grade.student?.student_no}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="number"
                              min="0"
                              max={assessment.max_score}
                              step="0.01"
                              value={grade.score || ''}
                              onChange={(e) => {
                                const score = e.target.value;
                                handleGradeChange(grade.student_id, 'score', score);
                                handleGradeChange(grade.student_id, 'letter_grade', calculateLetterGrade(score, assessment.max_score));
                              }}
                              className="w-20 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={grade.letter_grade || ''}
                              onChange={(e) => handleGradeChange(grade.student_id, 'letter_grade', e.target.value)}
                              className="w-16 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                              placeholder="A"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="text"
                              value={grade.comments || ''}
                              onChange={(e) => handleGradeChange(grade.student_id, 'comments', e.target.value)}
                              placeholder="Add comments..."
                              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => handleSaveGrade(grade.student_id)}
                              className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                              title="Save Grade"
                            >
                              <HiSave className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Stats */}
              {grades.length > 0 && (
                <div className="mt-6 bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Grade Summary</h4>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {grades.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Total Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {grades.filter(g => g.score && g.score > 0).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Graded</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {grades.filter(g => g.score && g.score > 0).length > 0 
                          ? Math.round(grades.filter(g => g.score && g.score > 0).reduce((sum, g) => sum + g.score, 0) / grades.filter(g => g.score && g.score > 0).length)
                          : 0
                        }
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Average Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        {grades.filter(g => g.score && g.score >= assessment.max_score * 0.5).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Passed</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-dark-700">
                <button
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveAllGrades}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <HiSave className="h-4 w-4" />
                      <span>Save All Grades</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradeAssessmentModal;
