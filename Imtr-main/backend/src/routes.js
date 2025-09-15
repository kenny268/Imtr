const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/user.routes');
const studentRoutes = require('./modules/students/student.routes');
const studentApprovalRoutes = require('./modules/students/student-approval.routes');
const studentOnboardingRoutes = require('./modules/students/student-onboarding.routes');
const programRoutes = require('./modules/programs/program.routes');
const courseRoutes = require('./modules/courses/course.routes');
const academicRoutes = require('./modules/academics/academic.routes');
const financeRoutes = require('./modules/finance/finance.routes');
const libraryRoutes = require('./modules/library/library.routes');
const researchRoutes = require('./modules/research/research.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const reportRoutes = require('./modules/reports/report.routes');

// Mount routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/student-approvals', studentApprovalRoutes);
router.use('/student-onboarding', studentOnboardingRoutes);
router.use('/programs', programRoutes);
router.use('/courses', courseRoutes);
router.use('/academics', academicRoutes);
router.use('/finance', financeRoutes);
router.use('/library', libraryRoutes);
router.use('/research', researchRoutes);
router.use('/notifications', notificationRoutes);
router.use('/reports', reportRoutes);

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'IMTR School Management System API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      users: '/users',
      students: '/students',
      programs: '/programs',
      courses: '/courses',
      academics: '/academics',
      finance: '/finance',
      library: '/library',
      research: '/research',
      notifications: '/notifications',
      reports: '/reports'
    },
    documentation: '/docs',
    health: '/health'
  });
});

module.exports = router;
