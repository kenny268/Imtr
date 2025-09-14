'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiUser, 
  HiMail, 
  HiShieldCheck, 
  HiClock, 
  HiCheckCircle, 
  HiXCircle,
  HiCalendar,
  HiPhone,
  HiLocationMarker,
  HiIdentification
} from 'react-icons/hi';

const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'LECTURER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'STUDENT': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'FINANCE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LIBRARIAN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'IT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={onClose}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-dark-800 rounded-xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                    <HiUser className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      User Details
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      View user information and activity
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <HiUser className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.profile?.first_name} {user.profile?.last_name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Full Name</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiMail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.profile?.phone || 'Not provided'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiIdentification className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.profile?.national_id || 'Not provided'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">National ID</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Account Status</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Role</span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Email Verified</span>
                        <div className="flex items-center">
                          {user.email_verified ? (
                            <span className="inline-flex items-center text-green-600 dark:text-green-400">
                              <HiCheckCircle className="h-4 w-4 mr-1" />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-red-600 dark:text-red-400">
                              <HiXCircle className="h-4 w-4 mr-1" />
                              Unverified
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Information */}
                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Activity Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <HiCalendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(user.created_at)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Account Created</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <HiClock className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {formatDate(user.last_login_at)}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Last Login</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information for Students */}
                {user.role === 'STUDENT' && (
                  <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Student Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <HiShieldCheck className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            Student ID: {user.id}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Student Number</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiLocationMarker className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.profile?.program || 'Not assigned'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-dark-700">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ViewUserModal;
