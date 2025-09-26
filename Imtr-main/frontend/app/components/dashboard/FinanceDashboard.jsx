'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiCurrencyDollar, 
  HiDocumentText, 
  HiChartBar,
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiRefresh,
  HiSearch,
  HiFilter,
  HiTrendingUp,
  HiTrendingDown,
  HiClock,
  HiCheckCircle,
  HiXCircle,
  HiExclamationCircle
} from 'react-icons/hi';
import { useAuth } from '@/app/lib/auth-context';
import { api } from '@/app/lib/api';
import CreateInvoiceModal from '../modals/CreateInvoiceModal';
import ViewInvoiceModal from '../modals/ViewInvoiceModal';
import EditInvoiceModal from '../modals/EditInvoiceModal';
import DeleteInvoiceModal from '../modals/DeleteInvoiceModal';
import CreatePaymentModal from '../modals/CreatePaymentModal';
import ViewPaymentModal from '../modals/ViewPaymentModal';
import FinancialReportsModal from '../modals/FinancialReportsModal';

const FinanceDashboard = ({ activeMenu }) => {
  const { hasPermission } = useAuth();
  
  // State management
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Modal states
  const [showCreateInvoiceModal, setShowCreateInvoiceModal] = useState(false);
  const [showViewInvoiceModal, setShowViewInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showDeleteInvoiceModal, setShowDeleteInvoiceModal] = useState(false);
  const [showCreatePaymentModal, setShowCreatePaymentModal] = useState(false);
  const [showViewPaymentModal, setShowViewPaymentModal] = useState(false);
  const [showReportsModal, setShowReportsModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);

  // Fetch data functions
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      
      const response = await api.get(`/finance/invoices?${params}`);
      if (response.data.success) {
        setInvoices(response.data.data.invoices);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await api.get('/finance/payments');
      if (response.data.success) {
        setPayments(response.data.data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await api.get('/finance/statistics');
      if (response.data.success) {
        setStatistics(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  useEffect(() => {
    if (activeMenu === 'finance') {
      fetchInvoices();
      fetchPayments();
      fetchStatistics();
    }
  }, [activeMenu, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowViewInvoiceModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowEditInvoiceModal(true);
  };

  const handleDeleteInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setShowDeleteInvoiceModal(true);
  };

  const handleViewPayment = (payment) => {
    setSelectedPayment(payment);
    setShowViewPaymentModal(true);
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Finance Dashboard</h1>
                  <p className="text-brand-100">Manage financial operations and transactions</p>
                </div>
                <div className="flex space-x-3">
                  {hasPermission('finance:write') && (
                    <button
                      onClick={() => setShowCreateInvoiceModal(true)}
                      className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                    >
                      <HiPlus className="h-5 w-5" />
                      <span>Add Invoice</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowReportsModal(true)}
                    className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                  >
                    <HiChartBar className="h-5 w-5" />
                    <span>Reports</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Statistics Cards */}
            {statistics && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">{statistics.invoices.total}</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                      <HiDocumentText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        KES {statistics.revenue.total?.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                      <HiTrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Invoices</p>
                      <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{statistics.invoices.pending}</p>
                    </div>
                    <div className="p-3 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                      <HiClock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Overdue Invoices</p>
                      <p className="text-2xl font-bold text-red-600 dark:text-red-400">{statistics.invoices.overdue}</p>
                    </div>
                    <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-lg">
                      <HiExclamationCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Recent Invoices */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark"
            >
              <div className="p-6 border-b border-gray-200 dark:border-dark-700">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Invoices</h3>
                  <button
                    onClick={fetchInvoices}
                    className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                  >
                    <HiRefresh className="h-5 w-5" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                  </div>
                ) : invoices.length > 0 ? (
                  <div className="space-y-4">
                    {invoices.slice(0, 5).map((invoice) => (
                      <div key={invoice.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-brand-100 dark:bg-brand-900/20 rounded-lg">
                            <HiDocumentText className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              KES {invoice.total_kes?.toLocaleString()}
                            </p>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {invoice.status}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewInvoice(invoice)}
                              className="p-2 text-gray-400 hover:text-brand-600 dark:hover:text-brand-400"
                            >
                              <HiEye className="h-4 w-4" />
                            </button>
                            {hasPermission('finance:write') && (
                              <>
                                <button
                                  onClick={() => handleEditInvoice(invoice)}
                                  className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                                >
                                  <HiPencil className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteInvoice(invoice)}
                                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                                >
                                  <HiTrash className="h-4 w-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <HiDocumentText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No invoices found</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        );

      case 'invoices':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoice Management</h1>
                <p className="text-gray-600 dark:text-gray-400">Manage student invoices and billing</p>
              </div>
              {hasPermission('finance:write') && (
                <button
                  onClick={() => setShowCreateInvoiceModal(true)}
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <HiPlus className="h-5 w-5" />
                  <span>Add Invoice</span>
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Search
                  </label>
                  <div className="relative">
                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={filters.search}
                      onChange={(e) => handleFilterChange('search', e.target.value)}
                      placeholder="Search invoices..."
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Items per page
                  </label>
                  <select
                    value={filters.limit}
                    onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent dark:bg-dark-700 dark:text-white"
                  >
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={fetchInvoices}
                    className="w-full bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    <HiRefresh className="h-4 w-4" />
                    <span>Refresh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark overflow-hidden">
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600"></div>
                </div>
              ) : invoices.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-dark-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Invoice
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Student
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Due Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-dark-700">
                      {invoices.map((invoice) => (
                        <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {invoice.invoice_number}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900 dark:text-white">
                              {invoice.student?.user?.profile?.first_name} {invoice.student?.user?.profile?.last_name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {invoice.student?.user?.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              KES {invoice.total_kes?.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                              invoice.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                              invoice.status === 'overdue' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                              'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {new Date(invoice.due_date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleViewInvoice(invoice)}
                                className="text-brand-600 hover:text-brand-900 dark:text-brand-400 dark:hover:text-brand-300"
                              >
                                <HiEye className="h-4 w-4" />
                              </button>
                              {hasPermission('finance:write') && (
                                <>
                                  <button
                                    onClick={() => handleEditInvoice(invoice)}
                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                  >
                                    <HiPencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteInvoice(invoice)}
                                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                  >
                                    <HiTrash className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <HiDocumentText className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No invoices found</p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1).replace('-', ' ')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">Content will be implemented here.</p>
          </div>
        );
    }
  };

  return (
    <>
      {renderContent()}
      
      {/* Modals */}
      <CreateInvoiceModal
        isOpen={showCreateInvoiceModal}
        onClose={() => setShowCreateInvoiceModal(false)}
        onSuccess={() => {
          fetchInvoices();
          fetchStatistics();
        }}
      />
      
      <ViewInvoiceModal
        isOpen={showViewInvoiceModal}
        onClose={() => {
          setShowViewInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
      />
      
      <EditInvoiceModal
        isOpen={showEditInvoiceModal}
        onClose={() => {
          setShowEditInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSuccess={() => {
          fetchInvoices();
          fetchStatistics();
        }}
      />
      
      <DeleteInvoiceModal
        isOpen={showDeleteInvoiceModal}
        onClose={() => {
          setShowDeleteInvoiceModal(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSuccess={() => {
          fetchInvoices();
          fetchStatistics();
        }}
      />
      
      <CreatePaymentModal
        isOpen={showCreatePaymentModal}
        onClose={() => setShowCreatePaymentModal(false)}
        onSuccess={() => {
          fetchPayments();
          fetchStatistics();
        }}
      />
      
      <ViewPaymentModal
        isOpen={showViewPaymentModal}
        onClose={() => {
          setShowViewPaymentModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
      
      <FinancialReportsModal
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
        statistics={statistics}
      />
    </>
  );
};

export default FinanceDashboard;
