const { sequelize } = require('../src/config/db');
const { logger } = require('../src/config/logger');

// Test database setup
beforeAll(async () => {
  try {
    // Connect to test database
    await sequelize.authenticate();
    
    // Sync database (create tables)
    await sequelize.sync({ force: true });
    
    logger.info('Test database setup completed');
  } catch (error) {
    logger.error('Test database setup failed:', error);
    throw error;
  }
});

// Clean up after each test
afterEach(async () => {
  // Clean up test data
  const models = sequelize.models;
  
  // Delete in reverse order of dependencies
  const modelNames = [
    'ProjectMember', 'ResearchProject', 'Loan', 'LibraryItem',
    'Payment', 'InvoiceItem', 'Invoice', 'FeeStructure',
    'Grade', 'Assessment', 'Attendance', 'Enrollment',
    'ClassSection', 'Course', 'Student', 'Lecturer', 'Program',
    'Profile', 'User'
  ];
  
  for (const modelName of modelNames) {
    if (models[modelName]) {
      await models[modelName].destroy({ where: {}, force: true });
    }
  }
});

// Clean up after all tests
afterAll(async () => {
  try {
    await sequelize.close();
    logger.info('Test database connection closed');
  } catch (error) {
    logger.error('Error closing test database:', error);
  }
});

// Global test utilities
global.testUtils = {
  // Create test user
  createTestUser: async (userData = {}) => {
    const { User } = require('../src/models');
    const { hashPassword } = require('../src/utils/crypto');
    
    const defaultData = {
      email: 'test@example.com',
      password_hash: await hashPassword('password123'),
      role: 'STUDENT',
      status: 'active',
      email_verified: true
    };
    
    return await User.create({ ...defaultData, ...userData });
  },
  
  // Create test profile
  createTestProfile: async (userId, profileData = {}) => {
    const { Profile } = require('../src/models');
    
    const defaultData = {
      user_id: userId,
      first_name: 'Test',
      last_name: 'User',
      phone: '+254700000000',
      gender: 'male'
    };
    
    return await Profile.create({ ...defaultData, ...profileData });
  },
  
  // Create test program
  createTestProgram: async (programData = {}) => {
    const { Program } = require('../src/models');
    
    const defaultData = {
      name: 'Test Program',
      code: 'TEST-PROG',
      description: 'Test program description',
      level: 'diploma',
      duration_months: 24,
      total_credits: 120,
      department: 'Test Department',
      status: 'active'
    };
    
    return await Program.create({ ...defaultData, ...programData });
  },
  
  // Create test course
  createTestCourse: async (programId, courseData = {}) => {
    const { Course } = require('../src/models');
    
    const defaultData = {
      program_id: programId,
      code: 'TEST101',
      title: 'Test Course',
      description: 'Test course description',
      credits: 3,
      semester: 1,
      year: 1,
      course_type: 'core',
      status: 'active'
    };
    
    return await Course.create({ ...defaultData, ...courseData });
  },
  
  // Generate JWT token for testing
  generateTestToken: (user) => {
    const { generateAccessToken } = require('../src/utils/jwt');
    
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };
    
    return generateAccessToken(payload);
  }
};
