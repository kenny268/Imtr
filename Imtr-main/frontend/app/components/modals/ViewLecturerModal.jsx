'use client';

import { motion } from 'framer-motion';
import { HiX, HiUser, HiMail, HiPhone, HiAcademicCap, HiOfficeBuilding, HiCalendar, HiBadgeCheck, HiMapPin, HiIdentification } from 'react-icons/hi';
import { formatDate, generateInitials } from '@/app/lib/utils';

const ViewLecturerModal = ({ isOpen, onClose, lecturer }) => {
  if (!isOpen || !lecturer) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400', text: 'Active' },
      inactive: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: 'Inactive' },
      suspended: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400', text: 'Suspended' }
    };
    
    const config = statusConfig[status] || statusConfig.inactive;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getDegreeBadge = (degree) => {
    const degreeConfig = {
      bachelor: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400', text: "Bachelor's" },
      master: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400', text: "Master's" },
      phd: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400', text: 'PhD' },
      postdoc: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400', text: 'Post-Doc' }
    };
    
    const config = degreeConfig[degree] || { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400', text: degree || 'Not specified' };
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
              <span className="text-brand-600 dark:text-brand-400 font-semibold text-lg">
                {generateInitials(`${lecturer.user?.profile?.first_name || ''} ${lecturer.user?.profile?.last_name || ''}`)}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.last_name}
              </h2>
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

        <div className="p-6 space-y-6">
          {/* Status and Basic Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {getStatusBadge(lecturer.status)}
              {getDegreeBadge(lecturer.highest_degree)}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-500">
              Joined {formatDate(lecturer.createdAt)}
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Personal Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Full Name</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.first_name} {lecturer.user?.profile?.middle_name} {lecturer.user?.profile?.last_name}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Gender</label>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {lecturer.user?.profile?.gender || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Date of Birth</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.date_of_birth ? formatDate(lecturer.user.profile.date_of_birth) : 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">National ID</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.national_id || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Address</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.address || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">City, County</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.city && lecturer.user?.profile?.county 
                      ? `${lecturer.user.profile.city}, ${lecturer.user.profile.county}`
                      : 'Not provided'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiMail className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Contact Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Email Address</label>
                  <p className="text-gray-900 dark:text-white">{lecturer.user?.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Phone Number</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.user?.profile?.phone || 'Not provided'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Office Location</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.office_location || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Office Phone</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.office_phone || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiAcademicCap className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Academic Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Specialization</label>
                  <p className="text-gray-900 dark:text-white">{lecturer.specialization}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Qualification</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.qualification || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Institution</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.institution || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Year Graduated</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.year_graduated || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Department</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.department?.name || 'Not assigned'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Research Interests</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.research_interests || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Teaching Experience</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.teaching_experience_years || 0} years
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Industry Experience</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.industry_experience_years || 0} years
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Employment Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center space-x-2">
              <HiOfficeBuilding className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <span>Employment Information</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Employment Date</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.employment_date ? formatDate(lecturer.employment_date) : 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Employment Type</label>
                  <p className="text-gray-900 dark:text-white capitalize">
                    {lecturer.employment_type?.replace('_', ' ') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Salary Scale</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.salary_scale || 'Not specified'}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Office Hours</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.office_hours || 'Not specified'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Max Students</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.max_students || 0}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Students</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.current_students || 0}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Is Mentor</label>
                  <p className="text-gray-900 dark:text-white">
                    {lecturer.is_mentor ? 'Yes' : 'No'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewLecturerModal;
