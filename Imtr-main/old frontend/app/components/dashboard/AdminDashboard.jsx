'use client';

import { motion } from 'framer-motion';
import { 
  HiUsers, 
  HiAcademicCap, 
  HiUserGroup, 
  HiBookOpen, 
  HiCollection, 
  HiCurrencyDollar, 
  HiLibrary, 
  HiChartBar, 
  HiCog,
  HiTrendingUp,
  HiClock,
  HiCheckCircle
} from 'react-icons/hi';

const AdminDashboard = ({ activeMenu }) => {
  const stats = [
    { label: 'Total Students', value: '1,234', icon: HiAcademicCap, change: '+12%', color: 'text-blue-600' },
    { label: 'Total Lecturers', value: '45', icon: HiUserGroup, change: '+5%', color: 'text-green-600' },
    { label: 'Active Courses', value: '78', icon: HiBookOpen, change: '+8%', color: 'text-purple-600' },
    { label: 'Total Revenue', value: 'KES 2.4M', icon: HiCurrencyDollar, change: '+15%', color: 'text-yellow-600' },
  ];

  const recentActivities = [
    { id: 1, action: 'New student enrolled', user: 'John Doe', time: '2 hours ago', type: 'enrollment' },
    { id: 2, action: 'Course created', user: 'Dr. Smith', time: '4 hours ago', type: 'course' },
    { id: 3, action: 'Payment received', user: 'Jane Wilson', time: '6 hours ago', type: 'payment' },
    { id: 4, action: 'User role updated', user: 'Admin', time: '8 hours ago', type: 'admin' },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">Welcome back, Admin!</h1>
              <p className="text-brand-100">Here's what's happening at IMTR today.</p>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <HiTrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 dark:text-green-400">
                      {stat.change} from last month
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 dark:bg-dark-700 rounded-lg">
                        <HiCheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.action}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.user} • {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="p-3 bg-brand-50 dark:bg-brand-900/20 rounded-lg hover:bg-brand-100 dark:hover:bg-brand-900/30 transition-colors">
                    <HiUsers className="h-6 w-6 text-brand-600 dark:text-brand-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-brand-900 dark:text-brand-100">
                      Add User
                    </p>
                  </button>
                  <button className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                    <HiBookOpen className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Create Course
                    </p>
                  </button>
                  <button className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                    <HiChartBar className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-purple-900 dark:text-purple-100">
                      View Reports
                    </p>
                  </button>
                  <button className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                    <HiCog className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                    <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">
                      Settings
                    </p>
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'users':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add User
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">User management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Students</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Student
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Student management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'lecturers':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lecturers</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Lecturer
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Lecturer management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'programs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Programs</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Program
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Program management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Courses</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Course
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Course management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'finance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Transaction
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Finance management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Add Book
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Library management content will be implemented here.</p>
            </div>
          </div>
        );

      case 'reports':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
              <button className="bg-brand-500 text-white px-4 py-2 rounded-lg hover:bg-brand-600 transition-colors">
                Generate Report
              </button>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Reports content will be implemented here.</p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Settings content will be implemented here.</p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Content not found</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default AdminDashboard;
