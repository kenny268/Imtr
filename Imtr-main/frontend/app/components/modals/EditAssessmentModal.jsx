'use client';

import { useState, useEffect } from 'react';
import { HiX, HiCalendar, HiClock, HiBookOpen, HiUsers, HiDocumentText } from 'react-icons/hi';
import { api } from '@/app/lib/api';
import { useUI } from '@/app/contexts/UIContext';

const EditAssessmentModal = ({ isOpen, onClose, assessment, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classSections, setClassSections] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [formData, setFormData] = useState({
    class_section_id: '',
    lecturer_id: '',
    title: '',
    type: 'assignment',
    max_score: '',
    weight: '',
    due_date: '',
    instructions: '',
    status: 'draft'
  });

  // Initialize form data when assessment changes
  useEffect(() => {
    if (assessment && isOpen) {
      setFormData({
        class_section_id: assessment.class_section_id || '',
        lecturer_id: assessment.lecturer_id || '',
        title: assessment.title || '',
        type: assessment.type || 'assignment',
        max_score: assessment.max_score || '',
        weight: assessment.weight || '',
        due_date: assessment.due_date ? new Date(assessment.due_date).toISOString().slice(0, 16) : '',
        instructions: assessment.instructions || '',
        status: assessment.status || 'draft'
      });
    }
  }, [assessment, isOpen]);

  // Fetch class sections and lecturers
  useEffect(() => {
    if (isOpen) {
      fetchClassSections();
      fetchLecturers();
    }
  }, [isOpen]);

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

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers?limit=100');
      if (response.data.success) {
        setLecturers(response.data.data.lecturers || []);
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || !assessment) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!formData.class_section_id || !formData.lecturer_id || !formData.title || !formData.max_score || !formData.weight) {
        showError('Please fill in all required fields');
        return;
      }

      // Convert numeric fields
      const submitData = {
        ...formData,
        class_section_id: parseInt(formData.class_section_id),
        lecturer_id: parseInt(formData.lecturer_id),
        max_score: parseFloat(formData.max_score),
        weight: parseFloat(formData.weight),
        due_date: formData.due_date || null
      };

      const response = await api.put(`/assessments/${assessment.id}`, submitData);
      
      if (response.data.success) {
        showSuccess('Assessment updated successfully');
        onSuccess();
        onClose();
      } else {
        showError(response.data.message || 'Failed to update assessment');
      }
    } catch (error) {
      console.error('Error updating assessment:', error);
      showError('Failed to update assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  if (!isOpen || !assessment) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Edit Assessment
          </h3>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-50"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Class Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Class Section *
            </label>
            <select
              name="class_section_id"
              value={formData.class_section_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">Select Class Section</option>
              {classSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.section_code} - {section.course?.title} ({section.academic_year})
                </option>
              ))}
            </select>
          </div>

          {/* Lecturer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Lecturer *
            </label>
            <select
              name="lecturer_id"
              value={formData.lecturer_id}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            >
              <option value="">Select Lecturer</option>
              {lecturers.map((lecturer) => (
                <option key={lecturer.id} value={lecturer.id}>
                  {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.last_name} ({lecturer.staff_no})
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Assessment Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              placeholder="Enter assessment title"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Type and Max Score */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assessment Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz</option>
                <option value="midterm">Midterm Exam</option>
                <option value="final">Final Exam</option>
                <option value="project">Project</option>
                <option value="presentation">Presentation</option>
                <option value="lab">Lab Work</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Score *
              </label>
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                placeholder="100"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Weight and Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Weight (%) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                required
                min="0"
                max="100"
                step="0.01"
                placeholder="25"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="datetime-local"
                name="due_date"
                value={formData.due_date}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleInputChange}
              rows={4}
              placeholder="Enter assessment instructions and requirements..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Status (only if draft) */}
          {assessment.status === 'draft' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <HiDocumentText className="h-4 w-4" />
                  <span>Update Assessment</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAssessmentModal;
