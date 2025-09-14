'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { HiExclamationCircle, HiArrowLeft, HiHome, HiSearch } from 'react-icons/hi';
import { useTheme } from '@/app/contexts/ThemeContext';

const NotFoundPage = () => {
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
          className="mx-auto h-24 w-24 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-6"
        >
          <HiExclamationCircle className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
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

          {/* Search Suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center justify-center mb-2">
              <HiSearch className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Looking for something specific?
              </p>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Try using the search function or navigation menu to find what you're looking for.
            </p>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Popular pages:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                onClick={() => router.push('/')}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/auth/login')}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => router.push('/auth/register')}
                className="px-3 py-1 text-xs bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
              >
                Register
              </button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
