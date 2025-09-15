'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, 
  HiUsers, 
  HiAcademicCap, 
  HiUserGroup, 
  HiBookOpen, 
  HiCollection, 
  HiCurrencyDollar, 
  HiLibrary, 
  HiChartBar, 
  HiCog,
  HiClipboardList,
  HiClock,
  HiLightBulb,
  HiDocumentText,
  HiCloud,
  HiChevronLeft,
  HiChevronRight,
  HiOfficeBuilding
} from 'react-icons/hi';
import { useAuth } from '@/app/lib/auth-context';
import { useNavigation } from '@/app/contexts/NavigationContext';
import { MENU_ITEMS, USER_ROLES } from '@/app/constants';
import { cn } from '@/app/lib/utils';

const Sidebar = () => {
  const { user } = useAuth();
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse, activeMenu, setMenu } = useNavigation();

  const userRole = user?.role || USER_ROLES.STUDENT;
  const menuItems = MENU_ITEMS[userRole] || MENU_ITEMS[USER_ROLES.STUDENT];

  const iconMap = {
    HiHome,
    HiUsers,
    HiAcademicCap,
    HiUserGroup,
    HiBookOpen,
    HiCollection,
    HiCurrencyDollar,
    HiLibrary,
    HiChartBar,
    HiCog,
    HiClipboardList,
    HiClock,
    HiLightBulb,
    HiDocumentText,
    HiCloud,
    HiOfficeBuilding,
  };

  const handleMenuClick = (menuId) => {
    setMenu(menuId);
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -280,
          width: sidebarCollapsed ? 80 : 280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 h-full bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 z-50',
          'lg:translate-x-0 lg:static lg:z-auto',
          sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
            {!sidebarCollapsed && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg font-bold text-gray-900 dark:text-white"
              >
                IMTR SMS
              </motion.h2>
            )}
            <button
              onClick={toggleSidebarCollapse}
              className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors hidden lg:block"
            >
              {sidebarCollapsed ? (
                <HiChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              ) : (
                <HiChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = iconMap[item.icon];
              const isActive = activeMenu === item.id;

              return (
                <motion.button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-brand-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-gray-500 dark:text-gray-400 text-center"
              >
                IMTR School Management System v1.0.0
              </motion.div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
