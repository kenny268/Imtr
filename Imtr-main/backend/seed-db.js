const { sequelize } = require('./src/config/db');
const { User, Profile, Program, Student, Lecturer } = require('./src/models');
const { hashPassword } = require('./src/utils/crypto');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    
    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await User.create({
      email: 'admin@imtr.ac.ke',
      password_hash: adminPassword,
      role: 'ADMIN',
      status: 'active',
      email_verified: true
    });

    // Create admin profile
    await Profile.create({
      user_id: adminUser.id,
      first_name: 'System',
      last_name: 'Administrator',
      phone: '+254700000000',
      gender: 'other'
    });

    // Create lecturer user
    const lecturerPassword = await hashPassword('lecturer123');
    const lecturerUser = await User.create({
      email: 'lecturer@imtr.ac.ke',
      password_hash: lecturerPassword,
      role: 'LECTURER',
      status: 'active',
      email_verified: true
    });

    // Create lecturer profile
    await Profile.create({
      user_id: lecturerUser.id,
      first_name: 'Dr. John',
      last_name: 'Meteorologist',
      phone: '+254700000001',
      gender: 'male'
    });

    // Create lecturer record
    await Lecturer.create({
      user_id: lecturerUser.id,
      staff_no: 'LEC000001',
      department: 'Meteorology',
      specialization: 'Weather Forecasting',
      qualification: 'PhD in Meteorology',
      highest_degree: 'PhD',
      institution: 'University of Nairobi',
      year_graduated: 2015,
      employment_date: '2020-01-01',
      employment_type: 'full_time',
      status: 'active'
    });

    // Create student user
    const studentPassword = await hashPassword('student123');
    const studentUser = await User.create({
      email: 'student@imtr.ac.ke',
      password_hash: studentPassword,
      role: 'STUDENT',
      status: 'active',
      email_verified: true
    });

    // Create student profile
    await Profile.create({
      user_id: studentUser.id,
      first_name: 'Jane',
      last_name: 'Student',
      phone: '+254700000002',
      gender: 'female'
    });

    // Create programs
    const program1 = await Program.create({
      name: 'Diploma in Meteorology',
      code: 'DIP-MET',
      description: 'Comprehensive diploma program in meteorological sciences',
      level: 'diploma',
      duration_months: 24,
      total_credits: 120,
      department: 'Meteorology',
      status: 'active'
    });

    const program2 = await Program.create({
      name: 'Certificate in Weather Observation',
      code: 'CERT-WO',
      description: 'Certificate program for weather observers',
      level: 'certificate',
      duration_months: 12,
      total_credits: 60,
      department: 'Meteorology',
      status: 'active'
    });

    // Create student record
    await Student.create({
      user_id: studentUser.id,
      student_no: 'STUDIP001',
      admission_date: '2024-01-01',
      program_id: program1.id,
      status: 'active',
      enrollment_year: 2024,
      expected_graduation_date: '2025-12-31'
    });

    console.log('Database seeded successfully!');
    console.log('Admin: admin@imtr.ac.ke / admin123');
    console.log('Lecturer: lecturer@imtr.ac.ke / lecturer123');
    console.log('Student: student@imtr.ac.ke / student123');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await sequelize.close();
  }
}

seedDatabase();
