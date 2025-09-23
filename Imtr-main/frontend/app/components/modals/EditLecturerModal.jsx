'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiUser, HiMail, HiPhone, HiAcademicCap, HiOfficeBuilding, HiCalendar, HiBadgeCheck } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const EditLecturerModal = ({ isOpen, onClose, lecturer, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    // Profile data
    first_name: '',
    last_name: '',
    middle_name: '',
    phone: '',
    gender: '',
    date_of_birth: '',
    address: '',
    city: '',
    county: '',
    postal_code: '',
    national_id: '',
    
    // Lecturer specific data
    staff_no: '',
    department: '',
    specialization: '',
    qualification: '',
    highest_degree: '',
    institution: '',
    year_graduated: '',
    employment_date: '',
    employment_type: 'full_time',
    status: 'active',
    salary_scale: '',
    office_location: '',
    office_phone: '',
    office_hours: '',
    research_interests: '',
    teaching_experience_years: '',
    industry_experience_years: '',
    is_mentor: false,
    max_students: 10
  });

  // Initialize form data when lecturer changes
  useEffect(() => {
    if (lecturer) {
      setFormData({
        first_name: lecturer.user?.profile?.first_name || '',
        last_name: lecturer.user?.profile?.last_name || '',
        middle_name: lecturer.user?.profile?.middle_name || '',
        phone: lecturer.user?.profile?.phone || '',
        gender: lecturer.user?.profile?.gender || '',
        date_of_birth: lecturer.user?.profile?.date_of_birth ? lecturer.user.profile.date_of_birth.split('T')[0] : '',
        address: lecturer.user?.profile?.address || '',
        city: lecturer.user?.profile?.city || '',
        county: lecturer.user?.profile?.county || '',
        postal_code: lecturer.user?.profile?.postal_code || '',
        national_id: lecturer.user?.profile?.national_id || '',
        staff_no: lecturer.staff_no || '',
        department: lecturer.department?.id || '',
        specialization: lecturer.specialization || '',
        qualification: lecturer.qualification || '',
        highest_degree: lecturer.highest_degree || '',
        institution: lecturer.institution || '',
        year_graduated: lecturer.year_graduated || '',
        employment_date: lecturer.employment_date ? lecturer.employment_date.split('T')[0] : '',
        employment_type: lecturer.employment_type || 'full_time',
        status: lecturer.status || 'active',
        salary_scale: lecturer.salary_scale || '',
        office_location: lecturer.office_location || '',
        office_phone: lecturer.office_phone || '',
        office_hours: lecturer.office_hours || '',
        research_interests: lecturer.research_interests || '',
        teaching_experience_years: lecturer.teaching_experience_years || '',
        industry_experience_years: lecturer.industry_experience_years || '',
        is_mentor: lecturer.is_mentor || false,
        max_students: lecturer.max_students || 10
      });
    }
  }, [lecturer]);

  // Fetch departments for dropdown
  const fetchDepartments = async () => {
    try {
      const response = await api.get('/departments?limit=100');
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
      fetchDepartments();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const submitData = {
        // Profile data
        profile: {
          first_name: formData.first_name.trim(),
          last_name: formData.last_name.trim(),
          middle_name: formData.middle_name.trim() || null,
          phone: formData.phone.trim() || null,
          gender: formData.gender || null,
          date_of_birth: formData.date_of_birth || null,
          address: formData.address.trim() || null,
          city: formData.city.trim() || null,
          county: formData.county.trim() || null,
          postal_code: formData.postal_code.trim() || null,
          national_id: formData.national_id.trim() || null
        },
        
        // Lecturer specific data
        lecturer: {
          staff_no: formData.staff_no.trim(),
          department_id: formData.department || null,
          specialization: formData.specialization.trim(),
          qualification: formData.qualification.trim(),
          highest_degree: formData.highest_degree,
          institution: formData.institution.trim(),
          year_graduated: formData.year_graduated ? parseInt(formData.year_graduated) : null,
          employment_date: formData.employment_date || null,
          employment_type: formData.employment_type,
          status: formData.status,
          salary_scale: formData.salary_scale.trim() || null,
          office_location: formData.office_location.trim() || null,
          office_phone: formData.office_phone.trim() || null,
          office_hours: formData.office_hours.trim() || null,
          research_interests: formData.research_interests.trim() || null,
          teaching_experience_years: formData.teaching_experience_years ? parseInt(formData.teaching_experience_years) : 0,
          industry_experience_years: formData.industry_experience_years ? parseInt(formData.industry_experience_years) : 0,
          is_mentor: formData.is_mentor,
          max_students: parseInt(formData.max_students)
        }
      };

      const response = await api.put(`/lecturers/${lecturer.id}`, submitData);
      
      if (response.data.success) {
        showSuccess('Lecturer updated successfully');
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Failed to update lecturer:', error);
      showError(error.response?.data?.message || 'Failed to update lecturer');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !lecturer) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
              <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Lecturer</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">{lecturer.staff_no}</p>
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
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middle_name"
                  value={formData.middle_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiMail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Contact Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={lecturer.user?.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email cannot be changed</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Lecturer Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiAcademicCap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Lecturer Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Staff Number *
                </label>
                <input
                  type="text"
                  name="staff_no"
                  value={formData.staff_no}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Department
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Specialization *
                </label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Highest Degree
                </label>
                <select
                  name="highest_degree"
                  value={formData.highest_degree}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Select Degree</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="postdoc">Post-Doctoral</option>
                </select>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiOfficeBuilding className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Employment Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Date
                </label>
                <input
                  type="date"
                  name="employment_date"
                  value={formData.employment_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Employment Type
                </label>
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="visiting">Visiting</option>
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
                  <option value="suspended">Suspended</option>
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
                  max="100"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Updating...' : 'Update Lecturer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLecturerModal;
