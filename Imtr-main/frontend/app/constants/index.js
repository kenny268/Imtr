// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  LECTURER: 'LECTURER',
  STUDENT: 'STUDENT',
  FINANCE: 'FINANCE',
  LIBRARIAN: 'LIBRARIAN',
  IT: 'IT',
};

// Menu Items for different roles
export const MENU_ITEMS = {
  [USER_ROLES.ADMIN]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'users', label: 'User Management', icon: 'HiUsers', path: '/users' },
    { id: 'students', label: 'Students', icon: 'HiAcademicCap', path: '/students' },
    { id: 'lecturers', label: 'Lecturers', icon: 'HiUserGroup', path: '/lecturers' },
    { id: 'programs', label: 'Programs', icon: 'HiBookOpen', path: '/programs' },
    { id: 'courses', label: 'Courses', icon: 'HiCollection', path: '/courses' },
    { id: 'examinations', label: 'Examinations', icon: 'HiClipboardList', path: '/examinations' },
    { id: 'faculty-departments', label: 'Faculty & Departments', icon: 'HiOfficeBuilding', path: '/faculty-departments' },
    { id: 'finance', label: 'Finance', icon: 'HiCurrencyDollar', path: '/finance' },
    { id: 'library', label: 'Library', icon: 'HiLibrary', path: '/library' },
    { id: 'reports', label: 'Reports', icon: 'HiChartBar', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'HiCog', path: '/settings' },
  ],
  [USER_ROLES.LECTURER]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'my-courses', label: 'My Courses', icon: 'HiBookOpen', path: '/my-courses' },
    { id: 'attendance', label: 'Attendance', icon: 'HiClipboardList', path: '/attendance' },
    { id: 'grades', label: 'Grades', icon: 'HiChartBar', path: '/grades' },
    { id: 'students', label: 'Students', icon: 'HiAcademicCap', path: '/students' },
    { id: 'research', label: 'Research', icon: 'HiLightBulb', path: '/research' },
    { id: 'profile', label: 'Profile', icon: 'HiUser', path: '/profile' },
  ],
  [USER_ROLES.STUDENT]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'my-courses', label: 'My Courses', icon: 'HiBookOpen', path: '/my-courses' },
    { id: 'timetable', label: 'Timetable', icon: 'HiClock', path: '/timetable' },
    { id: 'grades', label: 'Grades', icon: 'HiChartBar', path: '/grades' },
    { id: 'attendance', label: 'Attendance', icon: 'HiClipboardList', path: '/attendance' },
    { id: 'fees', label: 'Fees', icon: 'HiCurrencyDollar', path: '/fees' },
    { id: 'library', label: 'Library', icon: 'HiLibrary', path: '/library' },
    { id: 'profile', label: 'Profile', icon: 'HiUser', path: '/profile' },
  ],
  [USER_ROLES.FINANCE]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'invoices', label: 'Invoices', icon: 'HiDocumentText', path: '/invoices' },
    { id: 'payments', label: 'Payments', icon: 'HiCurrencyDollar', path: '/payments' },
    { id: 'students', label: 'Students', icon: 'HiAcademicCap', path: '/students' },
    { id: 'reports', label: 'Financial Reports', icon: 'HiChartBar', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'HiCog', path: '/settings' },
  ],
  [USER_ROLES.LIBRARIAN]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'catalog', label: 'Catalog', icon: 'HiCollection', path: '/catalog' },
    { id: 'loans', label: 'Loans', icon: 'HiBookOpen', path: '/loans' },
    { id: 'members', label: 'Members', icon: 'HiUsers', path: '/members' },
    { id: 'reports', label: 'Reports', icon: 'HiChartBar', path: '/reports' },
    { id: 'settings', label: 'Settings', icon: 'HiCog', path: '/settings' },
  ],
  [USER_ROLES.IT]: [
    { id: 'dashboard', label: 'Dashboard', icon: 'HiHome', path: '/' },
    { id: 'users', label: 'User Management', icon: 'HiUsers', path: '/users' },
    { id: 'system', label: 'System Status', icon: 'HiCog', path: '/system' },
    { id: 'logs', label: 'System Logs', icon: 'HiDocumentText', path: '/logs' },
    { id: 'backup', label: 'Backup', icon: 'HiCloud', path: '/backup' },
    { id: 'settings', label: 'Settings', icon: 'HiCog', path: '/settings' },
  ],
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    REGISTER: '/api/v1/auth/register',
    LOGOUT: '/api/v1/auth/logout',
    REFRESH: '/api/v1/auth/refresh',
    PROFILE: '/api/v1/auth/profile',
  },
  USERS: '/api/v1/users',
  STUDENTS: '/api/v1/students',
  LECTURERS: '/api/v1/lecturers',
  PROGRAMS: '/api/v1/programs',
  COURSES: '/api/v1/courses',
  FACULTIES: '/api/v1/faculties',
  DEPARTMENTS: '/api/v1/departments',
  FINANCE: '/api/v1/finance',
  LIBRARY: '/api/v1/library',
  REPORTS: '/api/v1/reports',
};

// Animation variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  slideUp: {
    initial: { y: 100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 100, opacity: 0 },
  },
  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },
};

// Status colors
export const STATUS_COLORS = {
  active: 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20',
  inactive: 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-900/20',
  pending: 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20',
  completed: 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20',
  failed: 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20',
  warning: 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20',
};
