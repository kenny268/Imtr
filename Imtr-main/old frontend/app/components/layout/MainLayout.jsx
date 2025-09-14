'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth-context';
import { useNavigation } from '@/app/contexts/NavigationContext';
import TopNavbar from './TopNavbar';
import Sidebar from './Sidebar';
import DashboardContent from '../dashboard/DashboardContent';

const MainLayout = ({ children }) => {
  const { user, loading } = useAuth();
  const { activeMenu } = useNavigation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return children;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900">
      <TopNavbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:ml-0">
          <div className="p-6">
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DashboardContent activeMenu={activeMenu} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
