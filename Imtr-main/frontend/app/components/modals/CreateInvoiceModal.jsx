'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HiX, HiPlus, HiTrash, HiCurrencyDollar } from 'react-icons/hi';
import { api } from '@/app/lib/api';

const CreateInvoiceModal = ({ isOpen, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [programs, setPrograms] = useState([]);
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    program_id: '',
    student_id: '', // Optional - for individual student or leave empty for all students in program
    due_date: '',
    fee_type: 'program_fees',
    notes: '',
    items: [
      {
        item: '',
        amount_kes: '',
        description: ''
      }
    ]
  });

  const [programFeeInfo, setProgramFeeInfo] = useState(null);
  const [loadingProgramInfo, setLoadingProgramInfo] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchPrograms();
    }
  }, [isOpen]);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/programs?limit=100');
      if (response.data.success) {
        setPrograms(response.data.data.programs || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const fetchStudents = async (programId) => {
    if (!programId) {
      setStudents([]);
      return;
    }
    try {
      const response = await api.get(`/students?program_id=${programId}&limit=100`);
      if (response.data.success) {
        setStudents(response.data.data.students || []);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchProgramFeeInfo = async (programId) => {
    if (!programId) {
      setProgramFeeInfo(null);
      return;
    }

    setLoadingProgramInfo(true);
    try {
      const response = await api.get(`/finance/fee-structures?program_id=${programId}`);
      if (response.data.success) {
        setProgramFeeInfo(response.data.data);
        // Auto-populate items based on fee type
        populateItemsFromFeeInfo(response.data.data, formData.fee_type);
      }
    } catch (error) {
      console.error('Error fetching program fee info:', error);
      setProgramFeeInfo(null);
    } finally {
      setLoadingProgramInfo(false);
    }
  };

  const populateItemsFromFeeInfo = (feeStructures, feeType) => {
    let items = [];

    if (feeType === 'program_fees' && feeStructures) {
      items = feeStructures.map(fee => ({
        item: fee.item,
        amount_kes: fee.amount_kes,
        description: fee.description || `Program fee for ${fee.program?.name || 'Program'}`
      }));
    }

    if (items.length > 0) {
      setFormData(prev => ({
        ...prev,
        items
      }));
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }

    // Fetch program fee info when program is selected
    if (field === 'program_id') {
      fetchProgramFeeInfo(value);
      fetchStudents(value);
    }

    // Re-populate items when fee type changes
    if (field === 'fee_type' && programFeeInfo) {
      populateItemsFromFeeInfo(programFeeInfo, value);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: newItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        {
          item: '',
          amount_kes: '',
          description: ''
        }
      ]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: newItems
      }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => {
      return total + (parseFloat(item.amount_kes) || 0);
    }, 0);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.program_id) {
      newErrors.program_id = 'Program is required';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    formData.items.forEach((item, index) => {
      if (!item.item.trim()) {
        newErrors[`item_${index}`] = 'Item name is required';
      }
      if (!item.amount_kes || parseFloat(item.amount_kes) <= 0) {
        newErrors[`amount_${index}`] = 'Valid amount is required';
      }
    });

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
      
      let response;
      
      if (formData.student_id) {
        // Generate invoice for specific student
        response = await api.post('/finance/invoices', formData);
      } else {
        // Generate invoices for all students in program
        const payload = {
          due_date: formData.due_date,
          notes: formData.notes,
          student_ids: [] // Empty array means all students in program
        };
        response = await api.post(`/finance/programs/${formData.program_id}/generate-invoices`, payload);
      }
      
      if (response.data.success) {
        onSuccess();
        onClose();
        setFormData({
          program_id: '',
          student_id: '',
          due_date: '',
          fee_type: 'program_fees',
          notes: '',
          items: [
            {
              item: '',
              amount_kes: '',
              description: ''
            }
          ]
        });
        setErrors({});
        setProgramFeeInfo(null);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
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
        className="bg-white dark:bg-dark-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-gray-200 dark:border-dark-700">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Create New Invoice
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
          {/* Program Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Program *
            </label>
            <select
              value={formData.program_id}
              onChange={(e) => handleChange('program_id', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white ${
                errors.program_id ? 'border-red-500' : 'border-gray-300 dark:border-dark-600'
              }`}
            >
              <option value="">Select a program</option>
              {programs.map((program) => (
                <option key={program.id} value={program.id}>
                  {program.name} ({program.code}) - {program.level}
                </option>
              ))}
            </select>
            {errors.program_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.program_id}</p>
            )}
          </div>

          {/* Optional Student Selection */}
          {formData.program_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Student (Optional - Leave empty to invoice all students in program)
              </label>
              <select
                value={formData.student_id}
                onChange={(e) => handleChange('student_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="">All students in program</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.user?.profile?.first_name} {student.user?.profile?.last_name} - {student.user?.email}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {students.length} students found in this program
              </p>
            </div>
          )}

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

          {/* Fee Type Selection */}
          {formData.program_id && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Fee Type *
              </label>
              <select
                value={formData.fee_type}
                onChange={(e) => handleChange('fee_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
              >
                <option value="program_fees">Program Fees (Based on Program Structure)</option>
                <option value="custom">Custom Items</option>
              </select>
            </div>
          )}

          {/* Program Information Display */}
          {loadingProgramInfo && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700 dark:text-blue-300">Loading program fee structure...</span>
              </div>
            </div>
          )}

          {programFeeInfo && !loadingProgramInfo && (
            <div className="bg-gray-50 dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Program Fee Structure</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Program:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {programs.find(p => p.id == formData.program_id)?.name} ({programs.find(p => p.id == formData.program_id)?.code})
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Students in Program:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {students.length} students
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Fee Items:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-medium">
                    {programFeeInfo.length} items
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Program Fees:</span>
                  <span className="ml-2 text-green-600 dark:text-green-400 font-medium">
                    KES {programFeeInfo.reduce((sum, fee) => sum + parseFloat(fee.amount_kes), 0).toLocaleString()}
                  </span>
                </div>
              </div>
              
              {formData.fee_type === 'program_fees' && programFeeInfo.length > 0 && (
                <div className="mt-3">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Available Fee Items:</span>
                  <div className="mt-1 space-y-1">
                    {programFeeInfo.map((fee, index) => (
                      <div key={index} className="text-xs text-gray-700 dark:text-gray-300">
                        • {fee.item} - KES {parseFloat(fee.amount_kes).toLocaleString()}
                        {fee.is_mandatory && <span className="text-red-600 dark:text-red-400 ml-1">(Mandatory)</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Invoice Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Invoice Items *
              </label>
              <div className="flex space-x-2">
                {formData.program_id && programFeeInfo && (
                  <button
                    type="button"
                    onClick={() => populateItemsFromFeeInfo(programFeeInfo, formData.fee_type)}
                    className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center space-x-1 text-sm"
                  >
                    <HiPlus className="h-4 w-4" />
                    <span>Auto-fill from Program Structure</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={addItem}
                  className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 flex items-center space-x-1"
                >
                  <HiPlus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Item {index + 1}
                    </h4>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        value={item.item}
                        onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                        placeholder="e.g., Tuition Fee"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm ${
                          errors[`item_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-dark-500'
                        }`}
                      />
                      {errors[`item_${index}`] && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[`item_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Amount (KES) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={item.amount_kes}
                        onChange={(e) => handleItemChange(index, 'amount_kes', e.target.value)}
                        placeholder="0.00"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm ${
                          errors[`amount_${index}`] ? 'border-red-500' : 'border-gray-300 dark:border-dark-500'
                        }`}
                      />
                      {errors[`amount_${index}`] && (
                        <p className="mt-1 text-xs text-red-600 dark:text-red-400">{errors[`amount_${index}`]}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Optional description"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-500 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-600 dark:text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Amount */}
          <div className="bg-brand-50 dark:bg-brand-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900 dark:text-white">Total Amount:</span>
              <span className="text-2xl font-bold text-brand-600 dark:text-brand-400 flex items-center">
                <HiCurrencyDollar className="h-6 w-6 mr-1" />
                KES {calculateTotal().toLocaleString()}
              </span>
            </div>
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
              <span>{loading ? 'Creating...' : formData.student_id ? 'Create Invoice' : `Create Invoices for All Students (${students.length})`}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateInvoiceModal;
