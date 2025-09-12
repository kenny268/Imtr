const { sequelize } = require('../config/db');
const { DataTypes } = require('sequelize');

// Import all models
const User = require('./User');
const Profile = require('./Profile');
const Student = require('./Student');
const Lecturer = require('./Lecturer');
const Program = require('./Program');
const Course = require('./Course');
const ClassSection = require('./ClassSection');
const Enrollment = require('./Enrollment');
const Attendance = require('./Attendance');
const Assessment = require('./Assessment');
const Grade = require('./Grade');
const FeeStructure = require('./FeeStructure');
const Invoice = require('./Invoice');
const InvoiceItem = require('./InvoiceItem');
const Payment = require('./Payment');
const LibraryItem = require('./LibraryItem');
const Loan = require('./Loan');
const ResearchProject = require('./ResearchProject');
const ProjectMember = require('./ProjectMember');
const Notification = require('./Notification');
const AuditLog = require('./AuditLog');

// Initialize models
const models = {
  User: User(sequelize, DataTypes),
  Profile: Profile(sequelize, DataTypes),
  Student: Student(sequelize, DataTypes),
  Lecturer: Lecturer(sequelize, DataTypes),
  Program: Program(sequelize, DataTypes),
  Course: Course(sequelize, DataTypes),
  ClassSection: ClassSection(sequelize, DataTypes),
  Enrollment: Enrollment(sequelize, DataTypes),
  Attendance: Attendance(sequelize, DataTypes),
  Assessment: Assessment(sequelize, DataTypes),
  Grade: Grade(sequelize, DataTypes),
  FeeStructure: FeeStructure(sequelize, DataTypes),
  Invoice: Invoice(sequelize, DataTypes),
  InvoiceItem: InvoiceItem(sequelize, DataTypes),
  Payment: Payment(sequelize, DataTypes),
  LibraryItem: LibraryItem(sequelize, DataTypes),
  Loan: Loan(sequelize, DataTypes),
  ResearchProject: ResearchProject(sequelize, DataTypes),
  ProjectMember: ProjectMember(sequelize, DataTypes),
  Notification: Notification(sequelize, DataTypes),
  AuditLog: AuditLog(sequelize, DataTypes)
};

// Define associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

// Export models and sequelize instance
module.exports = {
  sequelize,
  ...models
};
