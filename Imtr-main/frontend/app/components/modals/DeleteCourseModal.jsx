'use client';

import { useState } from 'react';
import { HiX, HiExclamationCircle } from 'react-icons/hi';
import { api } from '@/app/lib/api';
import { useUI } from '@/app/contexts/UIContext';

const DeleteCourseModal = ({ isOpen, onClose, course, onSuccess }) => {
  const { showError, showSuccess } = useUI();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !course) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await api.delete(`/courses/${course.id}`);
      showSuccess('Course deleted successfully');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting course:', error);
      showError('Failed to delete course. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <HiExclamationCircle className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Course
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Are you sure you want to delete this course? This action cannot be undone.
            </p>
            <div className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                {course.title}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Code:</span> {course.code}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Credits:</span> {course.credits}
              </p>
              {course.program && (
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">Program:</span> {course.program.name}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Course</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseModal;
