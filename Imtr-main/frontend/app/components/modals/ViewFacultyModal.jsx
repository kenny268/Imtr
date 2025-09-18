'use client';

import React from 'react';
import { HiX, HiOfficeBuilding, HiUser, HiLocationMarker, HiCalendar, HiStatusOnline } from 'react-icons/hi';

const ViewFacultyModal = ({ isOpen, onClose, faculty }) => {
  if (!isOpen || !faculty) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status] || statusClasses.inactive}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 rounded-lg bg-brand-100 dark:bg-brand-900 flex items-center justify-center">
              <HiOfficeBuilding className="h-8 w-8 text-brand-600 dark:text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Faculty Details
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                View faculty information
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

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faculty Name
              </label>
              <div className="flex items-center space-x-2">
                <HiOfficeBuilding className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white font-medium">
                  {faculty.name}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Faculty Code
              </label>
              <span className="text-gray-900 dark:text-white font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                {faculty.code}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Dean
              </label>
              <div className="flex items-center space-x-2">
                <HiUser className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {faculty.dean_name || 'Not assigned'}
                </span>
              </div>
              {faculty.dean_email && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {faculty.dean_email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-2">
                <HiStatusOnline className="h-5 w-5 text-gray-400" />
                {getStatusBadge(faculty.status)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Location
              </label>
              <div className="flex items-center space-x-2">
                <HiLocationMarker className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {faculty.location || 'No location specified'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Departments Count
              </label>
              <span className="text-gray-900 dark:text-white font-medium">
                {faculty.department_count || 0} departments
              </span>
            </div>
          </div>

          {/* Description */}
          {faculty.description && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                  {faculty.description}
                </p>
              </div>
            </div>
          )}

          {/* Timestamps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200 dark:border-dark-700">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Created Date
              </label>
              <div className="flex items-center space-x-2">
                <HiCalendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {formatDate(faculty.created_at)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Last Updated
              </label>
              <div className="flex items-center space-x-2">
                <HiCalendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 dark:text-white">
                  {formatDate(faculty.updated_at)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewFacultyModal;