'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiCheck, HiXCircle, HiUser, HiMail, HiPhone, HiCalendar, HiIdentification, HiAcademicCap } from 'react-icons/hi';
import { useUI } from '@/app/contexts/UIContext';

const StudentApprovalModal = ({ isOpen, onClose, student, onApprove, onReject, loading }) => {
  const { showSuccess, showError } = useUI();
  const [approvalData, setApprovalData] = useState({
    program_id: '',
    enrollment_year: new Date().getFullYear(),
    admission_date: new Date().toISOString().split('T')[0],
    scholarship_type: 'none',
    scholarship_amount: 0
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [activeTab, setActiveTab] = useState('approve');
  const [programs, setPrograms] = useState([]);

  useEffect(() => {
    if (isOpen && student) {
      // Reset form when modal opens
      setApprovalData({
        program_id: '',
        enrollment_year: new Date().getFullYear(),
        admission_date: new Date().toISOString().split('T')[0],
        scholarship_type: 'none',
        scholarship_amount: 0
      });
      setRejectionReason('');
      setActiveTab('approve');
    }
  }, [isOpen, student]);

  useEffect(() => {
    // Fetch programs when modal opens
    if (isOpen) {
      fetchPrograms();
    }
  }, [isOpen]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/v1/programs');
      const data = await response.json();
      if (data.success) {
        setPrograms(data.data.programs || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    }
  };

  const handleApprove = async (e) => {
    e.preventDefault();
    try {
      await onApprove(student.id, approvalData);
      showSuccess('Student registration approved successfully!');
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to approve student');
    }
  };

  const handleReject = async (e) => {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      showError('Please provide a reason for rejection');
      return;
    }
    try {
      await onReject(student.id, rejectionReason);
      showSuccess('Student registration rejected');
      onClose();
    } catch (error) {
      showError(error.response?.data?.message || 'Failed to reject student');
    }
  };

  if (!student) return null;

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
              className="relative bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-600">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <HiUser className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Student Registration Review
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review and approve/reject student registration
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <HiX className="h-5 w-5 text-gray-500" />
                </button>
              </div>

              {/* Student Info */}
              <div className="p-6 border-b border-gray-200 dark:border-dark-600">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <HiUser className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Name:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {student.profile?.first_name} {student.profile?.last_name}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiMail className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Email:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{student.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiPhone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Phone:</span>
                      <span className="text-sm text-gray-900 dark:text-white">{student.profile?.phone || 'Not provided'}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <HiCalendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Date of Birth:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {student.profile?.date_of_birth || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <HiIdentification className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">National ID:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {student.profile?.national_id || 'Not provided'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender:</span>
                      <span className="text-sm text-gray-900 dark:text-white capitalize">
                        {student.profile?.gender || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-dark-600">
                <button
                  onClick={() => setActiveTab('approve')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'approve'
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <HiCheck className="inline h-4 w-4 mr-2" />
                  Approve Registration
                </button>
                <button
                  onClick={() => setActiveTab('reject')}
                  className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                    activeTab === 'reject'
                      ? 'text-red-600 dark:text-red-400 border-b-2 border-red-600 dark:border-red-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <HiXCircle className="inline h-4 w-4 mr-2" />
                  Reject Registration
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {activeTab === 'approve' ? (
                  <form onSubmit={handleApprove} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Program *
                        </label>
                        <select
                          value={approvalData.program_id}
                          onChange={(e) => setApprovalData({ ...approvalData, program_id: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                          required
                        >
                          <option value="">Select Program</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.name} ({program.code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Enrollment Year *
                        </label>
                        <input
                          type="number"
                          value={approvalData.enrollment_year}
                          onChange={(e) => setApprovalData({ ...approvalData, enrollment_year: parseInt(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                          min="2020"
                          max="2030"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Admission Date *
                        </label>
                        <input
                          type="date"
                          value={approvalData.admission_date}
                          onChange={(e) => setApprovalData({ ...approvalData, admission_date: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Scholarship Type
                        </label>
                        <select
                          value={approvalData.scholarship_type}
                          onChange={(e) => setApprovalData({ ...approvalData, scholarship_type: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                        >
                          <option value="none">No Scholarship</option>
                          <option value="merit">Merit-based</option>
                          <option value="need_based">Need-based</option>
                          <option value="sports">Sports</option>
                          <option value="research">Research</option>
                          <option value="government">Government</option>
                        </select>
                      </div>

                      {approvalData.scholarship_type !== 'none' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Scholarship Amount (KES)
                          </label>
                          <input
                            type="number"
                            value={approvalData.scholarship_amount}
                            onChange={(e) => setApprovalData({ ...approvalData, scholarship_amount: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                            min="0"
                            step="0.01"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <HiCheck className="h-4 w-4" />
                        )}
                        <span>Approve Student</span>
                      </button>
                    </div>
                  </form>
                ) : (
                  <form onSubmit={handleReject} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Reason for Rejection *
                      </label>
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                        rows="4"
                        placeholder="Please provide a detailed reason for rejecting this student registration..."
                        required
                      />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || !rejectionReason.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                      >
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <HiXCircle className="h-4 w-4" />
                        )}
                        <span>Reject Registration</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentApprovalModal;
