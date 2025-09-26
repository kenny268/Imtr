'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiCurrencyDollar } from 'react-icons/hi';
import { api } from '@/app/lib/api';

const EditInvoiceModal = ({ isOpen, onClose, invoice, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    status: '',
    due_date: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (invoice) {
      setFormData({
        status: invoice.status || '',
        due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split('T')[0] : '',
        notes: invoice.notes || ''
      });
    }
  }, [invoice]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.status) {
      newErrors.status = 'Status is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await api.put(`/finance/invoices/${invoice.id}`, formData);
      
      if (response.data.success) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error('Error updating invoice:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
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
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Invoice - {invoice.invoice_number}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Status *
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.status ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            >
              <option value="">Select status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.status}</p>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => handleChange('due_date', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.due_date ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            />
            {errors.due_date && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.due_date}</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Additional notes for this invoice..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Invoice Summary */}
          <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <HiCurrencyDollar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Invoice Summary</h4>
            </div>
            <div className="space-y-1 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Student:</span>
                <span className="text-gray-900 dark:text-white">
                  {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Total Amount:</span>
                <span className="text-gray-900 dark:text-white font-semibold">
                  KES {parseFloat(invoice.total_kes).toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-dark-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-brand-400 text-white rounded-lg transition-colors flex items-center space-x-2"
            >
              {loading && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              )}
              <span>{loading ? 'Updating...' : 'Update Invoice'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditInvoiceModal;
