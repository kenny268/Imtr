'use client';

import React, { useState, useEffect } from 'react';
import { HiX, HiOfficeBuilding } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const EditFacultyModal = ({ isOpen, onClose, faculty, onSuccess }) => {
  const { showSuccess, showError } = useUI();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    dean_id: '',
    location: '',
    description: '',
    status: 'active'
  });
  const [lecturers, setLecturers] = useState([]);

  useEffect(() => {
    if (isOpen && faculty) {
      setFormData({
        name: faculty.name || '',
        code: faculty.code || '',
        dean_id: faculty.dean_id || '',
        location: faculty.location || '',
        description: faculty.description || '',
        status: faculty.status || 'active'
      });
      fetchLecturers();
    }
  }, [isOpen, faculty]);

  const fetchLecturers = async () => {
    try {
      const response = await api.get('/users?role=LECTURER&limit=100');
      if (response.data.success) {
        // Handle different possible response structures
        const data = response.data.data;
        if (Array.isArray(data)) {
          setLecturers(data);
        } else if (data && Array.isArray(data.users)) {
          setLecturers(data.users);
        } else {
          console.warn('Unexpected API response structure:', data);
          setLecturers([]);
        }
      }
    } catch (error) {
      console.error('Error fetching lecturers:', error);
      setLecturers([]);
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
    setLoading(true);

    try {
      const response = await api.put(`/faculties/${faculty.id}`, formData);
      
      if (response.data.success) {
        showSuccess('Faculty updated successfully!');
        onSuccess();
        onClose();
      } else {
        showError(response.data.message || 'Failed to update faculty');
      }
    } catch (error) {
      console.error('Error updating faculty:', error);
      showError(error.response?.data?.message || 'Failed to update faculty');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !faculty) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
              <HiOfficeBuilding className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Faculty
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Update faculty information
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <HiX className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Faculty Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faculty Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="e.g., Faculty of Engineering"
              />
            </div>

            {/* Faculty Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faculty Code *
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="e.g., FOE"
              />
            </div>

            {/* Dean */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dean
              </label>
              <select
                name="dean_id"
                value={formData.dean_id}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">Select Dean (Optional)</option>
                {Array.isArray(lecturers) && lecturers.map((lecturer) => (
                  <option key={lecturer.id} value={lecturer.id}>
                    {lecturer.profile?.first_name} {lecturer.profile?.last_name} ({lecturer.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                placeholder="e.g., Main Campus, Block A"
              />
            </div>

            {/* Status */}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              placeholder="Brief description of the faculty..."
            />
          </div>

          {/* Actions */}
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
              {loading ? 'Updating...' : 'Update Faculty'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFacultyModal;
