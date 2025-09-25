'use client';

import { useState, useEffect } from 'react';
import { HiX, HiCollection, HiBookOpen, HiClock, HiAcademicCap, HiUsers } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const EditCourseModal = ({ isOpen, onClose, course, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    program_id: '',
    code: '',
    title: '',
    description: '',
    credits: 3,
    semester: 1,
    year: 1,
    course_type: 'core',
    prerequisites: [],
    learning_objectives: [],
    course_content: [],
    assessment_methods: [],
    textbooks: [],
    references: [],
    status: 'active',
    is_offered: true,
    max_students: '',
    lecture_hours: 0,
    tutorial_hours: 0,
    practical_hours: 0,
    field_work_hours: 0,
    grading_system: {
      assignments: 30,
      midterm: 20,
      final_exam: 50
    },
    attendance_required: true,
    min_attendance_percentage: 75
  });

  // Initialize form data when course changes
  useEffect(() => {
    if (course) {
      setFormData({
        program_id: course.program_id || '',
        code: course.code || '',
        title: course.title || '',
        description: course.description || '',
        credits: course.credits || 3,
        semester: course.semester || 1,
        year: course.year || 1,
        course_type: course.course_type || 'core',
        prerequisites: course.prerequisites || [],
        learning_objectives: course.learning_objectives || [],
        course_content: course.course_content || [],
        assessment_methods: course.assessment_methods || [],
        textbooks: course.textbooks || [],
        references: course.references || [],
        status: course.status || 'active',
        is_offered: course.is_offered !== undefined ? course.is_offered : true,
        max_students: course.max_students || '',
        lecture_hours: course.lecture_hours || 0,
        tutorial_hours: course.tutorial_hours || 0,
        practical_hours: course.practical_hours || 0,
        field_work_hours: course.field_work_hours || 0,
        grading_system: course.grading_system || {
          assignments: 30,
          midterm: 20,
          final_exam: 50
        },
        attendance_required: course.attendance_required !== undefined ? course.attendance_required : true,
        min_attendance_percentage: course.min_attendance_percentage || 75
      });
    }
  }, [course]);

  // Fetch programs for dropdown
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

  // Fetch courses for prerequisites
  const fetchCourses = async () => {
    try {
      const response = await api.get('/courses/options');
      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
      fetchCourses();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? (value ? parseInt(value) : '') : value)
    }));
  };

  const handleGradingSystemChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      grading_system: {
        ...prev.grading_system,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleTextbookChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      textbooks: prev.textbooks.map((textbook, i) => 
        i === index ? { ...textbook, [field]: value } : textbook
      )
    }));
  };

  const addTextbook = () => {
    setFormData(prev => ({
      ...prev,
      textbooks: [...prev.textbooks, { title: '', author: '', edition: '', isbn: '', publisher: '' }]
    }));
  };

  const removeTextbook = (index) => {
    setFormData(prev => ({
      ...prev,
      textbooks: prev.textbooks.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data for submission
      const submitData = {
        ...formData,
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        prerequisites: formData.prerequisites.map(id => parseInt(id)).filter(id => !isNaN(id))
      };

      const response = await api.put(`/courses/${course.id}`, submitData);
      
      if (response.data.success) {
        showSuccess('Course updated successfully!');
        onSuccess?.(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Course update error:', error);
      showError(error.response?.data?.message || 'Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
              <HiCollection className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Course</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{course?.code}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <HiX className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiBookOpen className="h-5 w-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program *
                </label>
                <select
                  name="program_id"
                  value={formData.program_id}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Program</option>
                  {programs.map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.code})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., CSC101"
                  pattern="^[A-Z]{3}\d{3}$"
                  title="Format: 3 letters followed by 3 numbers (e.g., CSC101)"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Format: 3 letters followed by 3 numbers (e.g., CSC101)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Course Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g., Introduction to Computer Science"
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Credits *
                </label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Course Type
                </label>
                <select
                  name="course_type"
                  value={formData.course_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="core">Core</option>
                  <option value="elective">Elective</option>
                  <option value="prerequisite">Prerequisite</option>
                  <option value="general">General</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year *
                </label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="1">Year 1</option>
                  <option value="2">Year 2</option>
                  <option value="3">Year 3</option>
                  <option value="4">Year 4</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Semester *
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="1">Semester 1</option>
                  <option value="2">Semester 2</option>
                  <option value="3">Semester 3</option>
                  <option value="4">Semester 4</option>
                  <option value="5">Semester 5</option>
                  <option value="6">Semester 6</option>
                  <option value="7">Semester 7</option>
                  <option value="8">Semester 8</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Course description..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiAcademicCap className="h-5 w-5" />
              <span>Prerequisites</span>
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Prerequisite Courses
              </label>
              <select
                multiple
                value={formData.prerequisites}
                onChange={(e) => {
                  const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                  setFormData(prev => ({ ...prev, prerequisites: selectedOptions }));
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                size={5}
              >
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code} - {course.title}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Hold Ctrl/Cmd to select multiple courses
              </p>
            </div>
          </div>

          {/* Course Hours */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiClock className="h-5 w-5" />
              <span>Course Hours</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Lecture Hours
                </label>
                <input
                  type="number"
                  name="lecture_hours"
                  value={formData.lecture_hours}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tutorial Hours
                </label>
                <input
                  type="number"
                  name="tutorial_hours"
                  value={formData.tutorial_hours}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Practical Hours
                </label>
                <input
                  type="number"
                  name="practical_hours"
                  value={formData.practical_hours}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Field Work Hours
                </label>
                <input
                  type="number"
                  name="field_work_hours"
                  value={formData.field_work_hours}
                  onChange={handleInputChange}
                  min="0"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Grading System */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiUsers className="h-5 w-5" />
              <span>Grading System</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignments (%)
                </label>
                <input
                  type="number"
                  value={formData.grading_system.assignments}
                  onChange={(e) => handleGradingSystemChange('assignments', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Midterm (%)
                </label>
                <input
                  type="number"
                  value={formData.grading_system.midterm}
                  onChange={(e) => handleGradingSystemChange('midterm', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Final Exam (%)
                </label>
                <input
                  type="number"
                  value={formData.grading_system.final_exam}
                  onChange={(e) => handleGradingSystemChange('final_exam', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Updating...' : 'Update Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCourseModal;
