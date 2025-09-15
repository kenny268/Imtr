import { useState } from 'react';
import { HiX, HiExclamationCircle, HiBookOpen } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';
import { api } from '@/app/lib/api';

const DeleteProgramModal = ({ isOpen, onClose, program, onDelete }) => {
  const { showError, showSuccess } = useUI();
  const [loading, setLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (!program?.id) return;

    try {
      setLoading(true);
      const response = await api.delete(`/programs/${program.id}`);
      
      if (response.data.success) {
        showSuccess('Program deleted successfully');
        onDelete(program);
        onClose();
        setConfirmText('');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      } else {
        showError('Failed to delete program');
      }
    } finally {
      setLoading(false);
    }
  };

  const isConfirmValid = confirmText === program?.name;

  if (!isOpen || !program) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-xl max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <HiExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Delete Program
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This action cannot be undone
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

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
              <HiBookOpen className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {program.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {program.code} • {program.level?.charAt(0).toUpperCase() + program.level?.slice(1)}
              </p>
              {program.current_students > 0 && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  ⚠️ This program has {program.current_students} enrolled students
                </p>
              )}
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <HiExclamationCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3" />
              <div className="text-sm">
                <p className="text-red-800 dark:text-red-200 font-medium mb-1">
                  Warning: This action is permanent
                </p>
                <ul className="text-red-700 dark:text-red-300 space-y-1">
                  <li>• The program will be permanently deleted</li>
                  <li>• All associated courses will be affected</li>
                  <li>• Student enrollments will be impacted</li>
                  <li>• This action cannot be undone</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              To confirm deletion, type the program name: <span className="font-mono text-gray-900 dark:text-white">{program.name}</span>
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={`Type "${program.name}" to confirm`}
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-dark-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmValid || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Deleting...' : 'Delete Program'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProgramModal;
