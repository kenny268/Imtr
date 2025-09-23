import { useState, useEffect } from 'react';
import { HiX, HiBookOpen, HiAcademicCap, HiCurrencyDollar, HiCalendar, HiUsers } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const CreateProgramModal = ({ isOpen, onClose, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    level: 'bachelor',
    duration_months: 36,
    total_credits: 120,
    min_credits_per_semester: 12,
    max_credits_per_semester: 18,
    faculty_id: '',
    department_id: '',
    coordinator_id: '',
    status: 'active',
    accreditation_body: '',
    accreditation_number: '',
    accreditation_date: '',
    accreditation_expiry: '',
    tuition_fee: '',
    registration_fee: '',
    examination_fee: '',
    library_fee: '',
    laboratory_fee: '',
    start_date: '',
    end_date: '',
    application_deadline: '',
    max_students: '',
    entry_requirements: [],
    learning_outcomes: [],
    career_prospects: []
  });

  // Fetch lecturers for coordinator dropdown
  const fetchLecturers = async () => {
    try {
      const response = await api.get('/lecturers?limit=100');
      if (response.data.success) {
        const data = response.data.message;
        if (Array.isArray(data)) {
          setLecturers(data);
        } else if (data && Array.isArray(data.lecturers)) {
          setLecturers(data.lecturers);
        } else {
          setLecturers([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch lecturers:', error);
      setLecturers([]);
    }
  };

  // Fetch faculties for faculty dropdown
  const fetchFaculties = async () => {
    try {
      const response = await api.get('/faculties?limit=100');
      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setFaculties(data);
        } else if (data && Array.isArray(data.faculties)) {
          setFaculties(data.faculties);
        } else {
          setFaculties([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch faculties:', error);
      setFaculties([]);
    }
  };

  // Fetch departments for department dropdown
  const fetchDepartments = async (facultyId = null) => {
    try {
      const url = facultyId ? `/departments?faculty_id=${facultyId}&limit=100` : '/departments?limit=100';
      const response = await api.get(url);
      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setDepartments(data);
        } else if (data && Array.isArray(data.departments)) {
          setDepartments(data.departments);
        } else {
          setDepartments([]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch departments:', error);
      setDepartments([]);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLecturers();
      fetchFaculties();
      fetchDepartments();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : '') : value
    }));
  };

  const handleFacultyChange = (e) => {
    const facultyId = e.target.value;
    setFormData(prev => ({
      ...prev,
      faculty_id: facultyId,
      department_id: '' // Reset department when faculty changes
    }));
    
    // Fetch departments for the selected faculty
    if (facultyId) {
      fetchDepartments(facultyId);
    } else {
      fetchDepartments(); // Fetch all departments if no faculty selected
    }
  };

  const handleArrayInputChange = (field, value) => {
    const items = value.split('\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data for submission
      const submitData = {
        name: formData.name.trim(),
        code: formData.code.trim(),
        description: formData.description.trim() || null,
        level: formData.level,
        duration_months: parseInt(formData.duration_months),
        total_credits: parseInt(formData.total_credits),
        min_credits_per_semester: parseInt(formData.min_credits_per_semester),
        max_credits_per_semester: parseInt(formData.max_credits_per_semester),
        faculty_id: formData.faculty_id || null,
        department_id: formData.department_id || null,
        coordinator_id: formData.coordinator_id || null,
        status: formData.status,
        accreditation_body: formData.accreditation_body.trim() || '',
        accreditation_number: formData.accreditation_number.trim() || '',
        accreditation_date: formData.accreditation_date || null,
        accreditation_expiry: formData.accreditation_expiry || null,
        entry_requirements: formData.entry_requirements.length > 0 ? formData.entry_requirements : null,
        learning_outcomes: formData.learning_outcomes.length > 0 ? formData.learning_outcomes : null,
        career_prospects: formData.career_prospects.length > 0 ? formData.career_prospects : null,
        tuition_fee: formData.tuition_fee ? parseFloat(formData.tuition_fee) : null,
        registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : null,
        examination_fee: formData.examination_fee ? parseFloat(formData.examination_fee) : null,
        library_fee: formData.library_fee ? parseFloat(formData.library_fee) : null,
        laboratory_fee: formData.laboratory_fee ? parseFloat(formData.laboratory_fee) : null,
        other_fees: null, // This is a JSON field, can be extended later
        start_date: formData.start_date || null,
        end_date: formData.end_date || null,
        application_deadline: formData.application_deadline || null,
        max_students: formData.max_students ? parseInt(formData.max_students) : null
      };

      const response = await api.post('/programs', submitData);
      
      if (response.data.success) {
        showSuccess('Program created successfully!');
        onSuccess?.(response.data.data);
        onClose();
        // Reset form
        setFormData({
          name: '',
          code: '',
          description: '',
          level: 'bachelor',
          duration_months: 36,
          total_credits: 120,
          min_credits_per_semester: 12,
          max_credits_per_semester: 18,
          faculty_id: '',
          department_id: '',
          coordinator_id: '',
          status: 'active',
          accreditation_body: '',
          accreditation_number: '',
          accreditation_date: '',
          accreditation_expiry: '',
          tuition_fee: '',
          registration_fee: '',
          examination_fee: '',
          library_fee: '',
          laboratory_fee: '',
          start_date: '',
          end_date: '',
          application_deadline: '',
          max_students: '',
          entry_requirements: [],
          learning_outcomes: [],
          career_prospects: []
        });
      }
    } catch (error) {
      console.error('Failed to create program:', error);
      const errorMessage = error.response?.data?.message;
      const displayMessage = typeof errorMessage === 'object' 
        ? JSON.stringify(errorMessage) 
        : (errorMessage || 'Failed to create program');
      showError(displayMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
              <HiBookOpen className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Program</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Add a new academic program to the system</p>
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
              <HiAcademicCap className="h-5 w-5" />
              <span>Basic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="e.g., Bachelor of Computer Science"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Code *
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  placeholder="e.g., BCS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level *
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="certificate">Certificate</option>
                  <option value="diploma">Diploma</option>
                  <option value="bachelor">Bachelor</option>
                  <option value="master">Master</option>
                  <option value="phd">PhD</option>
                  <option value="postdoc">Postdoc</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (Months) *
                </label>
                <input
                  type="number"
                  name="duration_months"
                  value={formData.duration_months}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Credits *
                </label>
                <input
                  type="number"
                  name="total_credits"
                  value={formData.total_credits}
                  onChange={handleInputChange}
                  required
                  min="1"
                  max="200"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
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
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
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
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="Program description..."
              />
            </div>
          </div>

          {/* Department & Faculty */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Department & Faculty</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Faculty *
                </label>
                <select
                  name="faculty_id"
                  value={formData.faculty_id}
                  onChange={handleFacultyChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Faculty</option>
                  {Array.isArray(faculties) && faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name} ({faculty.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department *
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.faculty_id}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {formData.faculty_id ? 'Select Department' : 'Select Faculty first'}
                  </option>
                  {Array.isArray(departments) && departments.map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name} ({department.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Coordinator
                </label>
                <select
                  name="coordinator_id"
                  value={formData.coordinator_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Coordinator</option>
                  {lecturers.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.id}>
                      {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.last_name} ({lecturer.user?.email})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Fees */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiCurrencyDollar className="h-5 w-5" />
              <span>Fees</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tuition Fee (KES)
                </label>
                <input
                  type="number"
                  name="tuition_fee"
                  value={formData.tuition_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Registration Fee (KES)
                </label>
                <input
                  type="number"
                  name="registration_fee"
                  value={formData.registration_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Examination Fee (KES)
                </label>
                <input
                  type="number"
                  name="examination_fee"
                  value={formData.examination_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Library Fee (KES)
                </label>
                <input
                  type="number"
                  name="library_fee"
                  value={formData.library_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Laboratory Fee (KES)
                </label>
                <input
                  type="number"
                  name="laboratory_fee"
                  value={formData.laboratory_fee}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Max Students
                </label>
                <input
                  type="number"
                  name="max_students"
                  value={formData.max_students}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiCalendar className="h-5 w-5" />
              <span>Important Dates</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="application_deadline"
                  value={formData.application_deadline}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Learning Outcomes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Learning Outcomes</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Learning Outcomes (one per line)
              </label>
              <textarea
                value={formData.learning_outcomes.join('\n')}
                onChange={(e) => handleArrayInputChange('learning_outcomes', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="Students will be able to...&#10;Students will understand...&#10;Students will demonstrate..."
              />
            </div>
          </div>

          {/* Form Actions */}
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
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProgramModal;
