'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiCurrencyDollar } from 'react-icons/hi';
import { api } from '@/app/lib/api';

const CreatePaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [formData, setFormData] = useState({
    invoice_id: '',
    amount_kes: '',
    method: '',
    mpesa_ref: '',
    transaction_id: '',
    paid_at: new Date().toISOString().slice(0, 16),
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchInvoices();
    }
  }, [isOpen]);

  const fetchInvoices = async () => {
    try {
      const response = await api.get('/finance/invoices?limit=100');
      if (response.data.success) {
        setInvoices(response.data.data.invoices || []);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

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

    if (!formData.invoice_id) {
      newErrors.invoice_id = 'Invoice is required';
    }

    if (!formData.amount_kes || parseFloat(formData.amount_kes) <= 0) {
      newErrors.amount_kes = 'Valid amount is required';
    }

    if (!formData.method) {
      newErrors.method = 'Payment method is required';
    }

    if (!formData.paid_at) {
      newErrors.paid_at = 'Payment date is required';
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
      
      const response = await api.post('/finance/payments', formData);
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setFormData({
          invoice_id: '',
          amount_kes: '',
          method: '',
          mpesa_ref: '',
          transaction_id: '',
          paid_at: new Date().toISOString().slice(0, 16),
          notes: ''
        });
        setErrors({});
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Record Payment
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
          {/* Invoice Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Invoice *
            </label>
            <select
              value={formData.invoice_id}
              onChange={(e) => handleChange('invoice_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.invoice_id ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            >
              <option value="">Select an invoice</option>
              {invoices.map((invoice) => (
                <option key={invoice.id} value={invoice.id}>
                  {invoice.invoice_number} - {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name} (KES {parseFloat(invoice.total_kes).toLocaleString()})
                </option>
              ))}
            </select>
            {errors.invoice_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.invoice_id}</p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amount (KES) *
            </label>
            <div className="relative">
              <HiCurrencyDollar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.amount_kes}
                onChange={(e) => handleChange('amount_kes', e.target.value)}
                placeholder="0.00"
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                  errors.amount_kes ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                }`}
              />
            </div>
            {errors.amount_kes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount_kes}</p>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method *
            </label>
            <select
              value={formData.method}
              onChange={(e) => handleChange('method', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.method ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            >
              <option value="">Select payment method</option>
              <option value="mpesa">M-Pesa</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>
            {errors.method && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.method}</p>
            )}
          </div>

          {/* M-Pesa Reference (conditional) */}
          {formData.method === 'mpesa' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                M-Pesa Reference
              </label>
              <input
                type="text"
                value={formData.mpesa_ref}
                onChange={(e) => handleChange('mpesa_ref', e.target.value)}
                placeholder="e.g., QED123456789"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              />
            </div>
          )}

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              value={formData.transaction_id}
              onChange={(e) => handleChange('transaction_id', e.target.value)}
              placeholder="Transaction reference number"
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
          </div>

          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Date *
            </label>
            <input
              type="datetime-local"
              value={formData.paid_at}
              onChange={(e) => handleChange('paid_at', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.paid_at ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            />
            {errors.paid_at && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paid_at}</p>
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
              placeholder="Additional notes for this payment..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
            />
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
              <span>{loading ? 'Recording...' : 'Record Payment'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreatePaymentModal;
