'use client';

import { motion } from 'framer-motion';
import { HiX, HiChartBar, HiCurrencyDollar, HiDocumentText, HiTrendingUp, HiTrendingDown, HiClock, HiExclamationCircle } from 'react-icons/hi';

const FinancialReportsModal = ({ isOpen, onClose, statistics }) => {
  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return `KES ${amount?.toLocaleString() || '0'}`;
  };

  const getPercentage = (value, total) => {
    if (!total || total === 0) return 0;
    return Math.round((value / total) * 100);
  };

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
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Financial Reports & Analytics
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Overview Statistics */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <HiChartBar className="h-6 w-6 text-brand-600 dark:text-brand-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Financial Overview</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Revenue */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 dark:text-green-400">Total Revenue</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                      {formatCurrency(statistics?.revenue?.total)}
                    </p>
                  </div>
                  <div className="p-3 bg-green-200 dark:bg-green-800/30 rounded-lg">
                    <HiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>

              {/* Monthly Revenue */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">This Month</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                      {formatCurrency(statistics?.revenue?.monthly)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-200 dark:bg-blue-800/30 rounded-lg">
                    <HiCurrencyDollar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>

              {/* Total Invoices */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Invoices</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                      {statistics?.invoices?.total || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-200 dark:bg-purple-800/30 rounded-lg">
                    <HiDocumentText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>

              {/* Paid Invoices */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Paid Invoices</p>
                    <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                      {statistics?.invoices?.paid || 0}
                    </p>
                  </div>
                  <div className="p-3 bg-emerald-200 dark:bg-emerald-800/30 rounded-lg">
                    <HiTrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Status Breakdown */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Invoice Status Breakdown</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pending Invoices */}
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                    <HiClock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Pending</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Awaiting payment</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {statistics?.invoices?.pending || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getPercentage(statistics?.invoices?.pending, statistics?.invoices?.total)}% of total invoices
                </div>
              </div>

              {/* Overdue Invoices */}
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                    <HiExclamationCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Overdue</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Past due date</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-2">
                  {statistics?.invoices?.overdue || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {getPercentage(statistics?.invoices?.overdue, statistics?.invoices?.total)}% of total invoices
                </div>
              </div>

              {/* Collection Rate */}
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    <HiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Collection Rate</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment success rate</p>
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {getPercentage(statistics?.invoices?.paid, statistics?.invoices?.total)}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {statistics?.invoices?.paid || 0} of {statistics?.invoices?.total || 0} invoices paid
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods Analysis */}
          {statistics?.payment_methods && statistics.payment_methods.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Payment Methods Analysis</h3>
              
              <div className="bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-600 rounded-lg overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 dark:bg-dark-700 border-b border-gray-200 dark:border-dark-600">
                  <h4 className="font-medium text-gray-900 dark:text-white">Payment Method Breakdown</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-dark-600">
                  {statistics.payment_methods.map((method, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                            <HiCurrencyDollar className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {method.method.charAt(0).toUpperCase() + method.method.slice(1).replace('_', ' ')}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {method.count} transactions
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatCurrency(method.total)}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {getPercentage(method.total, statistics?.revenue?.total)}% of total revenue
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <HiDocumentText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div className="text-left">
                    <p className="font-medium text-blue-900 dark:text-blue-100">Generate Report</p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Export financial data</p>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <HiTrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <div className="text-left">
                    <p className="font-medium text-green-900 dark:text-green-100">View Analytics</p>
                    <p className="text-sm text-green-600 dark:text-green-400">Detailed insights</p>
                  </div>
                </div>
              </button>

              <button className="p-4 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <HiChartBar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  <div className="text-left">
                    <p className="font-medium text-purple-900 dark:text-purple-100">Dashboard</p>
                    <p className="text-sm text-purple-600 dark:text-purple-400">View full dashboard</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
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

export default FinancialReportsModal;
