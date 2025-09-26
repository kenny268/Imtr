'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiPlus, HiTrash, HiPencil, HiEye } from 'react-icons/hi';
import { api } from '@/app/lib/api';

const FeeStructureModal = ({ isOpen, onClose, programId, programName }) => {
  const [loading, setLoading] = useState(false);
  const [feeStructures, setFeeStructures] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [formData, setFormData] = useState({
    item: '',
    amount_kes: '',
    description: '',
    is_mandatory: true,
    due_date: '',
    status: 'active'
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && programId) {
      fetchFeeStructures();
    }
  }, [isOpen, programId]);

  const fetchFeeStructures = async () => {
    try {
      const response = await api.get(`/finance/fee-structures?program_id=${programId}`);
      if (response.data.success) {
        setFeeStructures(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching fee structures:', error);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const payload = {
        ...formData,
        program_id: programId,
        amount_kes: parseFloat(formData.amount_kes)
      };

      if (editingFee) {
        // Update existing fee structure
        const response = await api.put(`/finance/fee-structures/${editingFee.id}`, payload);
        if (response.data.success) {
          await fetchFeeStructures();
          resetForm();
        }
      } else {
        // Create new fee structure
        const response = await api.post('/finance/fee-structures', payload);
        if (response.data.success) {
          await fetchFeeStructures();
          resetForm();
        }
      }
    } catch (error) {
      console.error('Error saving fee structure:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      item: '',
      amount_kes: '',
      description: '',
      is_mandatory: true,
      due_date: '',
      status: 'active'
    });
    setEditingFee(null);
    setShowCreateForm(false);
    setErrors({});
  };

  const handleEdit = (fee) => {
    setEditingFee(fee);
    setFormData({
      item: fee.item,
      amount_kes: fee.amount_kes,
      description: fee.description || '',
      is_mandatory: fee.is_mandatory,
      due_date: fee.due_date || '',
      status: fee.status
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (feeId) => {
    if (!confirm('Are you sure you want to delete this fee structure?')) return;

    try {
      const response = await api.delete(`/finance/fee-structures/${feeId}`);
      if (response.data.success) {
        await fetchFeeStructures();
      }
    } catch (error) {
      console.error('Error deleting fee structure:', error);
    }
  };

  const totalAmount = feeStructures.reduce((sum, fee) => sum + parseFloat(fee.amount_kes), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Fee Structure Management
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {programName} - Total: KES {totalAmount.toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {!showCreateForm ? (
            <div className="space-y-6">
              {/* Header Actions */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Fee Structures ({feeStructures.length})
                </h3>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors flex items-center space-x-2"
                >
                  <HiPlus className="h-4 w-4" />
                  <span>Add Fee Structure</span>
                </button>
              </div>

              {/* Fee Structures List */}
              {feeStructures.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No fee structures found for this program.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {feeStructures.map((fee) => (
                    <div key={fee.id} className="bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900 dark:text-white">{fee.item}</h4>
                            {fee.is_mandatory && (
                              <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 text-xs px-2 py-1 rounded-full">
                                Mandatory
                              </span>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              fee.status === 'active' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                            }`}>
                              {fee.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {fee.description}
                          </p>
                          <div className="flex items-center space-x-4 mt-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">
                              Amount: <span className="font-medium text-gray-900 dark:text-white">KES {parseFloat(fee.amount_kes).toLocaleString()}</span>
                            </span>
                            {fee.due_date && (
                              <span className="text-gray-600 dark:text-gray-400">
                                Due: <span className="font-medium text-gray-900 dark:text-white">{new Date(fee.due_date).toLocaleDateString()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(fee)}
                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-2"
                            title="Edit"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(fee.id)}
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-2"
                            title="Delete"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Form Header */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {editingFee ? 'Edit Fee Structure' : 'Add New Fee Structure'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <HiX className="h-6 w-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Fee Item *
                    </label>
                    <input
                      type="text"
                      value={formData.item}
                      onChange={(e) => handleChange('item', e.target.value)}
                      placeholder="e.g., Tuition Fee, Registration Fee"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                        errors.item ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.item && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.item}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Amount (KES) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.amount_kes}
                      onChange={(e) => handleChange('amount_kes', e.target.value)}
                      placeholder="0.00"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                        errors.amount_kes ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
                      }`}
                    />
                    {errors.amount_kes && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount_kes}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Optional description for this fee"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={formData.due_date}
                      onChange={(e) => handleChange('due_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="is_mandatory"
                      checked={formData.is_mandatory}
                      onChange={(e) => handleChange('is_mandatory', e.target.checked)}
                      className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_mandatory" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Mandatory Fee
                    </label>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 rounded-lg hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Saving...' : (editingFee ? 'Update' : 'Create')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FeeStructureModal;
