'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/app/lib/auth-context';
import { USER_ROLES } from '@/app/constants';

// Import dashboard components for different roles
import AdminDashboard from './AdminDashboard';
import LecturerDashboard from './LecturerDashboard';
import StudentDashboard from './StudentDashboard';
import FinanceDashboard from './FinanceDashboard';
import LibrarianDashboard from './LibrarianDashboard';
import ITDashboard from './ITDashboard';

const DashboardContent = ({ activeMenu }) => {
  const { user } = useAuth();
  const userRole = user?.role || USER_ROLES.STUDENT;

  const renderDashboard = () => {
    switch (userRole) {
      case USER_ROLES.ADMIN:
        return <AdminDashboard activeMenu={activeMenu} />;
      case USER_ROLES.LECTURER:
        return <LecturerDashboard activeMenu={activeMenu} />;
      case USER_ROLES.STUDENT:
        return <StudentDashboard activeMenu={activeMenu} />;
      case USER_ROLES.FINANCE:
        return <FinanceDashboard activeMenu={activeMenu} />;
      case USER_ROLES.LIBRARIAN:
        return <LibrarianDashboard activeMenu={activeMenu} />;
      case USER_ROLES.IT:
        return <ITDashboard activeMenu={activeMenu} />;
      default:
        return <StudentDashboard activeMenu={activeMenu} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {renderDashboard()}
    </motion.div>
  );
};

export default DashboardContent;
