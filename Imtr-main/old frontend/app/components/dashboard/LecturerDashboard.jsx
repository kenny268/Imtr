'use client';

import { motion } from 'framer-motion';
import { HiBookOpen, HiClipboardList, HiChartBar, HiAcademicCap, HiLightBulb, HiUser } from 'react-icons/hi';

const LecturerDashboard = ({ activeMenu }) => {
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-xl p-6 text-white"
            >
              <h1 className="text-2xl font-bold mb-2">Welcome back, Lecturer!</h1>
              <p className="text-brand-100">Manage your courses and students effectively.</p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">My Courses</h3>
                <p className="text-gray-600 dark:text-gray-400">Course management content will be implemented here.</p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Attendance</h3>
                <p className="text-gray-600 dark:text-gray-400">Attendance management content will be implemented here.</p>
              </div>
              <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Grades</h3>
                <p className="text-gray-600 dark:text-gray-400">Grade management content will be implemented here.</p>
              </div>
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

  return renderContent();
};

export default LecturerDashboard;
