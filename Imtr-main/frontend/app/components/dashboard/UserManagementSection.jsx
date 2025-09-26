'use client';

import { useState } from 'react';
import { 
  HiUser,
  HiUsers,
  HiPlus,
  HiEye,
  HiPencil,
  HiTrash,
  HiRefresh,
  HiSearch,
  HiViewGrid,
  HiViewList,
  HiFilter,
  HiChevronDown,
  HiCog,
  HiShieldCheck,
  HiClock,
  HiCheckCircle,
  HiXCircle
} from 'react-icons/hi';

const UserManagementSection = ({ 
  users, 
  loading, 
  userPagination, 
  userFilters, 
  userViewMode, 
  hasPermission, 
  setShowCreateUserModal, 
  setShowViewModal,
  setShowEditModal,
  setShowDeleteModal,
  setSelectedUser,
  handleUserFilterChange, 
  refreshUsers, 
  fetchUsers,
  setUserViewMode 
}) => {
  // Action handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleSaveUser = async (userData) => {
    console.log('Saving user:', userData);
    // TODO: Implement API call to update user
    // await api.put(`/users/${selectedUser.id}`, userData);
    refreshUsers();
  };

  const handleDeleteConfirm = async (user) => {
    console.log('Deleting user:', user);
    // TODO: Implement API call to delete user
    // await api.delete(`/users/${user.id}`);
    refreshUsers();
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };
  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'LECTURER': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'STUDENT': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'FINANCE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'LIBRARIAN': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'IT': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ADMIN': return <HiShieldCheck className="h-4 w-4" />;
      case 'LECTURER': return <HiUser className="h-4 w-4" />;
      case 'STUDENT': return <HiUsers className="h-4 w-4" />;
      case 'FINANCE': return <HiCog className="h-4 w-4" />;
      case 'LIBRARIAN': return <HiUser className="h-4 w-4" />;
      case 'IT': return <HiCog className="h-4 w-4" />;
      default: return <HiUser className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
        <div className="flex items-center space-x-3">
          <button
            onClick={refreshUsers}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            title="Refresh"
          >
            <HiRefresh className="h-5 w-5" />
          </button>
          {hasPermission('users:write') && (
            <button 
              onClick={() => setShowCreateUserModal(true)}
              className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors flex items-center space-x-2"
            >
              <HiPlus className="h-5 w-5" />
              <span>Add User</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Search and Filter Bar */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={userFilters.search}
                onChange={(e) => handleUserFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
              />
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              value={userFilters.role}
              onChange={(e) => handleUserFilterChange('role', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Roles</option>
              <option value="ADMIN">Admin</option>
              <option value="LECTURER">Lecturer</option>
              <option value="STUDENT">Student</option>
              <option value="FINANCE">Finance</option>
              <option value="LIBRARIAN">Librarian</option>
              <option value="IT">IT Support</option>
            </select>

            <select
              value={userFilters.status}
              onChange={(e) => handleUserFilterChange('status', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>

            <select
              value={userFilters.emailVerified}
              onChange={(e) => handleUserFilterChange('emailVerified', e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="">All Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <select
              value={`${userFilters.sortBy}-${userFilters.sortOrder}`}
              onChange={(e) => {
                const [sortBy, sortOrder] = e.target.value.split('-');
                handleUserFilterChange('sortBy', sortBy);
                handleUserFilterChange('sortOrder', sortOrder);
              }}
              className="px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="created_at-desc">Newest First</option>
              <option value="created_at-asc">Oldest First</option>
              <option value="email-asc">Email A-Z</option>
              <option value="email-desc">Email Z-A</option>
              <option value="role-asc">Role A-Z</option>
              <option value="role-desc">Role Z-A</option>
              <option value="last_login_at-desc">Last Login</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 dark:border-dark-600 rounded-lg">
            <button
              onClick={() => setUserViewMode('table')}
              className={`p-2 ${userViewMode === 'table' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <HiViewList className="h-5 w-5" />
            </button>
            <button
              onClick={() => setUserViewMode('grid')}
              className={`p-2 ${userViewMode === 'grid' ? 'bg-brand-500 text-white' : 'text-gray-500 dark:text-gray-400'}`}
            >
              <HiViewGrid className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Advanced Filter Toggle */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-700">
          <button className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            <HiFilter className="h-4 w-4" />
            <span>Advanced Filters</span>
            <HiChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Users Content */}
      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-soft dark:shadow-soft-dark">
        {loading ? (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <HiUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding a new user.</p>
            {hasPermission('users:write') && (
              <button 
                onClick={() => setShowCreateUserModal(true)}
                className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors"
              >
                Add First User
              </button>
            )}
          </div>
        ) : userViewMode === 'table' ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-dark-700">
              <thead className="bg-gray-50 dark:bg-dark-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Email Verified
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-dark-800 divide-y divide-gray-200 dark:divide-dark-700">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-dark-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                            {getRoleIcon(user.role)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.profile?.first_name} {user.profile?.last_name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                        {getRoleIcon(user.role)}
                        <span className="ml-1">{user.role}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email_verified ? (
                        <span className="inline-flex items-center text-green-600 dark:text-green-400">
                          <HiCheckCircle className="h-4 w-4 mr-1" />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-red-600 dark:text-red-400">
                          <HiXCircle className="h-4 w-4 mr-1" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(user.last_login_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
                          title="View User"
                        >
                          <HiEye className="h-4 w-4" />
                        </button>
                        {hasPermission('users:write') && (
                          <button 
                            onClick={() => handleEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
                            title="Edit User"
                          >
                            <HiPencil className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('users:delete') && (
                          <button 
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/20"
                            title="Delete User"
                          >
                            <HiTrash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user) => (
              <div key={user.id} className="bg-gray-50 dark:bg-dark-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-brand-100 dark:bg-brand-900/20 flex items-center justify-center">
                    {getRoleIcon(user.role)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.profile?.first_name} {user.profile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1">{user.role}</span>
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Email:</span> {user.email_verified ? 'Verified' : 'Unverified'}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Last Login:</span> {formatDate(user.last_login_at)}
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(user.created_at)}
                    </div>
                    <div className="flex space-x-1">
                      <button 
                        onClick={() => handleViewUser(user)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900/20"
                        title="View User"
                      >
                        <HiEye className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 p-1 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/20"
                        title="Edit User"
                      >
                        <HiPencil className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {userPagination.total_pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700 dark:text-gray-300">
                Showing {((userPagination.current_page - 1) * userPagination.per_page) + 1} to{' '}
                {Math.min(userPagination.current_page * userPagination.per_page, userPagination.total)} of{' '}
                {userPagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => fetchUsers(userPagination.current_page - 1)}
                  disabled={userPagination.current_page === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => fetchUsers(userPagination.current_page + 1)}
                  disabled={userPagination.current_page === userPagination.total_pages}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-md hover:bg-gray-50 dark:hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

export default UserManagementSection;
