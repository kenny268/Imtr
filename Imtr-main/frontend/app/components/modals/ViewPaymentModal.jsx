'use client';

import { motion } from 'framer-motion';
import { HiX, HiCurrencyDollar, HiCheckCircle, HiClock, HiXCircle, HiExclamationCircle } from 'react-icons/hi';

const ViewPaymentModal = ({ isOpen, onClose, payment }) => {
  if (!isOpen || !payment) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <HiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <HiClock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <HiXCircle className="h-5 w-5 text-red-500" />;
      case 'cancelled':
        return <HiExclamationCircle className="h-5 w-5 text-gray-500" />;
      default:
        return <HiClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'mpesa':
        return '📱';
      case 'card':
        return '💳';
      case 'bank_transfer':
        return '🏦';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };

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
              Payment Details
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Payment Header */}
          <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <span className="text-2xl">{getMethodIcon(payment.method)}</span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)} Payment
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Recorded on {new Date(payment.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(payment.status)}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Paid: {new Date(payment.paid_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <HiCurrencyDollar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Payment Amount</h4>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                KES {parseFloat(payment.amount_kes).toLocaleString()}
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Method</h4>
              <div className="flex items-center space-x-2">
                <span className="text-xl">{getMethodIcon(payment.method)}</span>
                <span className="text-gray-900 dark:text-white">
                  {payment.method.charAt(0).toUpperCase() + payment.method.slice(1).replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Invoice Information */}
          {payment.invoice && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Related Invoice</h4>
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                <div className="space-y-2">
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Invoice Number:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      {payment.invoice.invoice_number}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Student:</span>
                    <span className="text-gray-900 dark:text-white">
                      {payment.invoice.student?.user?.profile?.first_name} {payment.invoice.student?.user?.profile?.last_name}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Invoice Total:</span>
                    <span className="text-gray-900 dark:text-white font-medium">
                      KES {parseFloat(payment.invoice.total_kes).toLocaleString()}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Transaction Details */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Transaction Details</h4>
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <div className="space-y-2">
                {payment.transaction_id && (
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Transaction ID:</span>
                    <span className="text-gray-900 dark:text-white font-mono text-sm">
                      {payment.transaction_id}
                    </span>
                  </p>
                )}
                {payment.mpesa_ref && (
                  <p className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">M-Pesa Reference:</span>
                    <span className="text-gray-900 dark:text-white font-mono text-sm">
                      {payment.mpesa_ref}
                    </span>
                  </p>
                )}
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment Date:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(payment.paid_at).toLocaleString()}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Recorded:</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(payment.created_at).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {payment.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Notes</h4>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{payment.notes}</p>
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-dark-700">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewPaymentModal;
