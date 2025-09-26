'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiExclamationCircle } from 'react-icons/hi';
import { api } from '@/app/lib/api';

const DeleteInvoiceModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      
      const response = await api.delete(`/finance/invoices/${invoice.id}`);
      
      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error deleting invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !invoice) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <HiExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Delete Invoice
            </h2>
          </div>

          <div className="mb-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Are you sure you want to delete this invoice? This action cannot be undone.
            </p>
            
            <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                Invoice Details:
              </h4>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    {invoice.invoice_number}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Student:</span>
                  <span className="text-gray-900 dark:text-white">
                    {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="text-gray-900 dark:text-white font-medium">
                    KES {parseFloat(invoice.total_kes).toLocaleString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Status:</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                    invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                    invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                  }`}>
                    {invoice.status}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Deleting...' : 'Delete Invoice'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DeleteInvoiceModal;
