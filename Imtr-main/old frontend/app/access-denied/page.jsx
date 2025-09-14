'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiLockClosed, HiArrowLeft, HiHome } from 'react-icons/hi';
import { useTheme } from '@/app/contexts/ThemeContext';

const AccessDeniedPage = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mx-auto h-24 w-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6"
        >
          <HiLockClosed className="h-12 w-12 text-red-600 dark:text-red-400" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.back()}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              <HiArrowLeft className="h-5 w-5 mr-2" />
              Go Back
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push('/')}
              className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-dark-600 text-base font-medium rounded-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
            >
              <HiHome className="h-5 w-5 mr-2" />
              Go to Dashboard
            </motion.button>
          </div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
          >
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Need help?</strong> If you believe you should have access to this resource, please contact the system administrator or IT support team.
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AccessDeniedPage;
