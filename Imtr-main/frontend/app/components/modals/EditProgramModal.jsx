import { useState, useEffect } from 'react';
import { HiX, HiBookOpen, HiCurrencyDollar, HiCalendar, HiCheckCircle, HiUsers, HiAcademicCap } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const EditProgramModal = ({ isOpen, onClose, program, onSave }) => {
  const { showError, showSuccess } = useUI();
  const [loading, setLoading] = useState(false);
  const [lecturers, setLecturers] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    level: '',
    duration_months: '',
    total_credits: '',
    faculty_id: '',
    department_id: '',
    status: 'active',
    coordinator_id: '',
    max_students: '',
    tuition_fee: '',
    registration_fee: '',
    other_fees: '',
    application_start_date: '',
    application_end_date: '',
    program_start_date: '',
    program_end_date: '',
    accreditation_body: '',
    accreditation_number: '',
    accreditation_date: '',
    accreditation_expiry: '',
    entry_requirements: '',
    learning_outcomes: '',
    career_prospects: ''
  });

  // Fetch lecturers for coordinator dropdown
  const fetchLecturers = async () => {
    try {
      const response = await api.get('/users?role=LECTURER&limit=100');
      if (response.data.success) {
        const data = response.data.data;
        if (Array.isArray(data)) {
          setLecturers(data);
        } else if (data && Array.isArray(data.users)) {
          setLecturers(data.users);
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

  useEffect(() => {
    if (program && isOpen) {
      setFormData({
        name: program.name || '',
        code: program.code || '',
        description: program.description || '',
        level: program.level || '',
        duration_months: program.duration_months || '',
        total_credits: program.total_credits || '',
        faculty_id: program.faculty_id || '',
        department_id: program.department_id || '',
        status: program.status || 'active',
        coordinator_id: program.coordinator_id || '',
        max_students: program.max_students || '',
        tuition_fee: program.tuition_fee || '',
        registration_fee: program.registration_fee || '',
        other_fees: program.other_fees || '',
        application_start_date: program.application_start_date ? program.application_start_date.split('T')[0] : '',
        application_end_date: program.application_end_date ? program.application_end_date.split('T')[0] : '',
        program_start_date: program.program_start_date ? program.program_start_date.split('T')[0] : '',
        program_end_date: program.program_end_date ? program.program_end_date.split('T')[0] : '',
        accreditation_body: program.accreditation_body || '',
        accreditation_number: program.accreditation_number || '',
        accreditation_date: program.accreditation_date ? program.accreditation_date.split('T')[0] : '',
        accreditation_expiry: program.accreditation_expiry ? program.accreditation_expiry.split('T')[0] : '',
        entry_requirements: program.entry_requirements || '',
        learning_outcomes: program.learning_outcomes || '',
        career_prospects: program.career_prospects || ''
      });
      
      // Fetch data for dropdowns
      fetchLecturers();
      fetchFaculties();
      
      // Fetch departments based on the program's faculty
      if (program.faculty_id) {
        fetchDepartments(program.faculty_id);
      } else {
        fetchDepartments();
      }
    }
  }, [program, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!program?.id) return;

    try {
      setLoading(true);
      
      // Convert string numbers to actual numbers
      const submitData = {
        ...formData,
        duration_months: formData.duration_months ? parseInt(formData.duration_months) : null,
        total_credits: formData.total_credits ? parseInt(formData.total_credits) : null,
        max_students: formData.max_students ? parseInt(formData.max_students) : null,
        tuition_fee: formData.tuition_fee ? parseFloat(formData.tuition_fee) : null,
        registration_fee: formData.registration_fee ? parseFloat(formData.registration_fee) : null,
        other_fees: formData.other_fees ? parseFloat(formData.other_fees) : null,
        coordinator_id: formData.coordinator_id || null
      };

      const response = await api.put(`/programs/${program.id}`, submitData);
      
      if (response.data.success) {
        showSuccess('Program updated successfully');
        onSave(response.data.data);
        onClose();
      }
    } catch (error) {
      console.error('Error updating program:', error);
      showError('Failed to update program');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
              <HiBookOpen className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Program
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Update program information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
          >
            <HiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiBookOpen className="h-5 w-5 mr-2" />
              Basic Information
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
                  <option value="">Select Level</option>
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
                  Status *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (months)
                </label>
                <input
                  type="number"
                  name="duration_months"
                  value={formData.duration_months}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Total Credits
                </label>
                <input
                  type="number"
                  name="total_credits"
                  value={formData.total_credits}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

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
              />
            </div>
          </div>

          {/* Fees Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiCurrencyDollar className="h-5 w-5 mr-2" />
              Fees Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  Other Fees (KES)
                </label>
                <input
                  type="number"
                  name="other_fees"
                  value={formData.other_fees}
                  onChange={handleInputChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Important Dates */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiCalendar className="h-5 w-5 mr-2" />
              Important Dates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application Start Date
                </label>
                <input
                  type="date"
                  name="application_start_date"
                  value={formData.application_start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Application End Date
                </label>
                <input
                  type="date"
                  name="application_end_date"
                  value={formData.application_end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program Start Date
                </label>
                <input
                  type="date"
                  name="program_start_date"
                  value={formData.program_start_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Program End Date
                </label>
                <input
                  type="date"
                  name="program_end_date"
                  value={formData.program_end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Accreditation */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiCheckCircle className="h-5 w-5 mr-2" />
              Accreditation
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accrediting Body
                </label>
                <input
                  type="text"
                  name="accreditation_body"
                  value={formData.accreditation_body}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accreditation Number
                </label>
                <input
                  type="text"
                  name="accreditation_number"
                  value={formData.accreditation_number}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accreditation Date
                </label>
                <input
                  type="date"
                  name="accreditation_date"
                  value={formData.accreditation_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Accreditation Expiry
                </label>
                <input
                  type="date"
                  name="accreditation_expiry"
                  value={formData.accreditation_expiry}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <HiAcademicCap className="h-5 w-5 mr-2" />
              Additional Information
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Entry Requirements
              </label>
              <textarea
                name="entry_requirements"
                value={formData.entry_requirements}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Learning Outcomes
              </label>
              <textarea
                name="learning_outcomes"
                value={formData.learning_outcomes}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Career Prospects
              </label>
              <textarea
                name="career_prospects"
                value={formData.career_prospects}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
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
              {loading ? 'Updating...' : 'Update Program'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProgramModal;
