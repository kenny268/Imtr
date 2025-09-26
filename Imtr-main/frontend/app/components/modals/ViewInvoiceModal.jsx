'use client';

import { motion } from 'framer-motion';
import { HiX, HiDocumentText, HiUser, HiCalendar, HiCurrencyDollar, HiCheckCircle, HiClock, HiExclamationCircle } from 'react-icons/hi';

const ViewInvoiceModal = ({ isOpen, onClose, invoice }) => {
  if (!isOpen || !invoice) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <HiCheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <HiClock className="h-5 w-5 text-yellow-500" />;
      case 'overdue':
        return <HiExclamationCircle className="h-5 w-5 text-red-500" />;
      default:
        return <HiClock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const calculateTotalPaid = () => {
    if (!invoice.payments) return 0;
    return invoice.payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + parseFloat(payment.amount_kes), 0);
  };

  const calculateBalance = () => {
    return parseFloat(invoice.total_kes) - calculateTotalPaid();
  };

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
              Invoice Details
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
          {/* Invoice Header */}
          <div className="bg-gray-50 dark:bg-dark-700 p-6 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {invoice.invoice_number}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Created on {new Date(invoice.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(invoice.status)}
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoice.status)}`}>
                    {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Student Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <HiUser className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Student Information</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Email:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {invoice.student?.user?.email}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Phone:</span>
                  <span className="ml-2 text-gray-900 dark:text-white">
                    {invoice.student?.user?.profile?.phone || 'N/A'}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <HiCurrencyDollar className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Financial Summary</h4>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Total Amount:</span>
                  <span className="ml-2 text-gray-900 dark:text-white font-semibold">
                    KES {parseFloat(invoice.total_kes).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Amount Paid:</span>
                  <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">
                    KES {calculateTotalPaid().toLocaleString()}
                  </span>
                </p>
                <p className="text-sm">
                  <span className="font-medium text-gray-600 dark:text-gray-400">Balance:</span>
                  <span className={`ml-2 font-semibold ${
                    calculateBalance() > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                  }`}>
                    KES {calculateBalance().toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Invoice Items */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <HiDocumentText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
              <h4 className="font-semibold text-gray-900 dark:text-white">Invoice Items</h4>
            </div>
            
            <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-dark-600">
                  {invoice.items?.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                        {item.item}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                        {item.description || 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white text-right">
                        KES {parseFloat(item.amount_kes).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 dark:bg-dark-700">
                  <tr>
                    <td colSpan="2" className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white">
                      Total
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-900 dark:text-white text-right">
                      KES {parseFloat(invoice.total_kes).toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment History */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <HiCheckCircle className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Payment History</h4>
              </div>
              
              <div className="space-y-3">
                {invoice.payments.map((payment, index) => (
                  <div key={index} className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          KES {parseFloat(payment.amount_kes).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.method.charAt(0).toUpperCase() + payment.method.slice(1)} payment
                        </p>
                        {payment.transaction_id && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            Transaction ID: {payment.transaction_id}
                          </p>
                        )}
                        {payment.mpesa_ref && (
                          <p className="text-xs text-gray-500 dark:text-gray-500">
                            M-Pesa Ref: {payment.mpesa_ref}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                          'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                        }`}>
                          {payment.status}
                        </span>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(payment.paid_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {payment.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {payment.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {invoice.notes && (
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Notes</h4>
              <div className="bg-gray-50 dark:bg-dark-700 p-4 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">{invoice.notes}</p>
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

export default ViewInvoiceModal;
