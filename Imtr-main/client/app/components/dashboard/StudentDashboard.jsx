'use client';

import { motion } from 'framer-motion';
import { 
  HiBookOpen, 
  HiClock, 
  HiChartBar, 
  HiClipboardList, 
  HiCurrencyDollar, 
  HiLibrary, 
  HiUser,
  HiCalendar,
  HiAcademicCap,
  HiCheckCircle,
  HiExclamationTriangle
} from 'react-icons/hi';

const StudentDashboard = ({ activeMenu }) => {
  const stats = [
    { label: 'Enrolled Courses', value: '6', icon: HiBookOpen, color: 'text-blue-600' },
    { label: 'GPA', value: '3.8', icon: HiChartBar, color: 'text-green-600' },
    { label: 'Attendance', value: '95%', icon: HiClipboardList, color: 'text-purple-600' },
    { label: 'Outstanding Fees', value: 'KES 15,000', icon: HiCurrencyDollar, color: 'text-yellow-600' },
  ];

  const upcomingClasses = [
    { course: 'Meteorology 101', time: '09:00 AM', room: 'Room A-101', lecturer: 'Dr. Smith' },
    { course: 'Climate Science', time: '11:00 AM', room: 'Room B-205', lecturer: 'Prof. Johnson' },
    { course: 'Weather Forecasting', time: '02:00 PM', room: 'Lab C-301', lecturer: 'Dr. Brown' },
  ];

  const recentGrades = [
    { course: 'Meteorology 101', assignment: 'Midterm Exam', grade: 'A', score: 92 },
    { course: 'Climate Science', assignment: 'Lab Report', grade: 'A-', score: 88 },
    { course: 'Weather Forecasting', assignment: 'Project', grade: 'B+', score: 85 },
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
              <h1 className="text-2xl font-bold mb-2">Welcome back, Student!</h1>
              <p className="text-brand-100">Track your academic progress and stay updated.</p>
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
                </motion.div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Classes */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiCalendar className="h-5 w-5 mr-2 text-brand-500" />
                  Today's Classes
                </h3>
                <div className="space-y-3">
                  {upcomingClasses.map((classItem, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{classItem.course}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{classItem.lecturer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{classItem.time}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">{classItem.room}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Recent Grades */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <HiChartBar className="h-5 w-5 mr-2 text-brand-500" />
                  Recent Grades
                </h3>
                <div className="space-y-3">
                  {recentGrades.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{grade.course}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{grade.assignment}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{grade.grade}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{grade.score}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                  <HiBookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-blue-900 dark:text-blue-100">View Courses</p>
                </button>
                <button className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                  <HiClock className="h-6 w-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-green-900 dark:text-green-100">Timetable</p>
                </button>
                <button className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
                  <HiCurrencyDollar className="h-6 w-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-purple-900 dark:text-purple-100">Pay Fees</p>
                </button>
                <button className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors">
                  <HiLibrary className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Library</p>
                </button>
              </div>
            </motion.div>
          </div>
        );

      case 'my-courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Courses</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">My courses content will be implemented here.</p>
            </div>
          </div>
        );

      case 'timetable':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Timetable content will be implemented here.</p>
            </div>
          </div>
        );

      case 'grades':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grades</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Grades content will be implemented here.</p>
            </div>
          </div>
        );

      case 'attendance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Attendance content will be implemented here.</p>
            </div>
          </div>
        );

      case 'fees':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Fees</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Fees content will be implemented here.</p>
            </div>
          </div>
        );

      case 'library':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Library</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Library content will be implemented here.</p>
            </div>
          </div>
        );

      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
            </div>
            <div className="bg-white dark:bg-dark-800 rounded-xl p-6 shadow-soft dark:shadow-soft-dark">
              <p className="text-gray-600 dark:text-gray-400">Profile content will be implemented here.</p>
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

export default StudentDashboard;
