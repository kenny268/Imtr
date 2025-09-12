'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMenu, 
  HiX, 
  HiBell, 
  HiUser, 
  HiCog, 
  HiLogout,
  HiSun,
  HiMoon,
  HiChevronDown
} from 'react-icons/hi';
import { useAuth } from '@/app/lib/auth-context';
import { useTheme } from '@/app/contexts/ThemeContext';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { cn, generateInitials } from '@/app/lib/utils';

const TopNavbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toggleSidebar } = useNavigation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 px-4 py-3 flex items-center justify-between sticky top-0 z-50"
    >
      {/* Left side */}
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          <HiMenu className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        </button>
        
        <div className="hidden md:block">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            IMTR School Management
          </h1>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
        >
          {theme === 'dark' ? (
            <HiSun className="h-5 w-5 text-yellow-500" />
          ) : (
            <HiMoon className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors relative"
          >
            <HiBell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-80 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700"
              >
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Notifications
                  </h3>
                  <div className="space-y-2">
                    <div className="p-2 bg-gray-50 dark:bg-dark-700 rounded">
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        New assignment posted
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        2 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <div className="h-8 w-8 bg-brand-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {user ? generateInitials(user.name || user.email) : 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role || 'Role'}
              </p>
            </div>
            <HiChevronDown className="h-4 w-4 text-gray-500" />
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-lg shadow-lg border border-gray-200 dark:border-dark-700"
              >
                <div className="py-1">
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">
                    <HiUser className="h-4 w-4 mr-3" />
                    Profile
                  </button>
                  <button className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700">
                    <HiCog className="h-4 w-4 mr-3" />
                    Settings
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-dark-700" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <HiLogout className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
};

export default TopNavbar;
