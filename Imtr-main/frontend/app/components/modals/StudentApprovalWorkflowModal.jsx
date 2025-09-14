'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiX, 
  HiAcademicCap, 
  HiCheckCircle,
  HiXCircle,
  HiClock,
  HiUser,
  HiMail,
  HiPhone,
  HiIdentification,
  HiBookOpen,
  HiCalendar,
  HiExclamationCircle
} from 'react-icons/hi';

const StudentApprovalWorkflowModal = ({ isOpen, onClose, student, onApprove, onReject }) => {
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      await onApprove(student);
      onClose();
    } catch (error) {
      console.error('Error approving student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      await onReject(student, rejectionReason);
      onClose();
      setRejectionReason('');
      setShowRejectForm(false);
    } catch (error) {
      console.error('Error rejecting student:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
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
        day: 'numeric'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  if (!isOpen || !student) return null;

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
              className="relative w-full max-w-4xl bg-white dark:bg-dark-800 rounded-xl shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex items-center justify-center">
                    <HiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Student Approval Workflow
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Review and approve student registration
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
                {/* Student Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Student Information</h3>
                    
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                          <HiUser className="h-6 w-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900 dark:text-white">
                            {student.profile?.first_name} {student.profile?.last_name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {student.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Student ID</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            STU{String(student.id).padStart(6, '0')}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Registration Date</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {formatDate(student.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contact Details</h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <HiMail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.email}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Email Address</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiPhone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.profile?.phone || 'Not provided'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Phone Number</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <HiIdentification className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.profile?.national_id || 'Not provided'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">National ID</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Academic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <HiBookOpen className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.profile?.program || 'Not assigned'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Program</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <HiCalendar className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {student.created_at ? new Date(student.created_at).getFullYear() : 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Enrollment Year</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Rejection Reason Form */}
                {showRejectForm && (
                  <div className="border-t border-gray-200 dark:border-dark-700 pt-6">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rejection Reason</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Please provide a reason for rejection:
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-dark-700 dark:text-white"
                          placeholder="Enter the reason for rejecting this student application..."
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-dark-700">
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <HiExclamationCircle className="h-4 w-4" />
                  <span>This action will be recorded in the audit log</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  
                  {!showRejectForm ? (
                    <>
                      <button
                        onClick={() => setShowRejectForm(true)}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <HiXCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                      
                      <button
                        onClick={handleApprove}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <HiCheckCircle className="h-4 w-4" />
                        <span>{loading ? 'Approving...' : 'Approve'}</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowRejectForm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      
                      <button
                        onClick={handleReject}
                        disabled={loading || !rejectionReason.trim()}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center space-x-2"
                      >
                        <HiXCircle className="h-4 w-4" />
                        <span>{loading ? 'Rejecting...' : 'Confirm Rejection'}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default StudentApprovalWorkflowModal;
