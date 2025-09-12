'use strict';

const { hashPassword } = require('../utils/crypto');

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const adminUser = await queryInterface.bulkInsert('users', [{
      email: 'admin@imtr.ac.ke',
      password_hash: adminPassword,
      role: 'ADMIN',
      status: 'active',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true });

    // Create admin profile
    await queryInterface.bulkInsert('profiles', [{
      user_id: adminUser[0].id,
      first_name: 'System',
      last_name: 'Administrator',
      phone: '+254700000000',
      gender: 'other',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create lecturer user
    const lecturerPassword = await hashPassword('lecturer123');
    const lecturerUser = await queryInterface.bulkInsert('users', [{
      email: 'lecturer@imtr.ac.ke',
      password_hash: lecturerPassword,
      role: 'LECTURER',
      status: 'active',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true });

    // Create lecturer profile
    await queryInterface.bulkInsert('profiles', [{
      user_id: lecturerUser[0].id,
      first_name: 'Dr. John',
      last_name: 'Meteorologist',
      phone: '+254700000001',
      gender: 'male',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create lecturer record
    await queryInterface.bulkInsert('lecturers', [{
      user_id: lecturerUser[0].id,
      staff_no: 'LEC001',
      department: 'Meteorology',
      specialization: 'Weather Forecasting',
      qualification: 'PhD in Meteorology',
      highest_degree: 'PhD',
      institution: 'University of Nairobi',
      year_graduated: 2015,
      employment_date: '2020-01-01',
      employment_type: 'full_time',
      status: 'active',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create student user
    const studentPassword = await hashPassword('student123');
    const studentUser = await queryInterface.bulkInsert('users', [{
      email: 'student@imtr.ac.ke',
      password_hash: studentPassword,
      role: 'STUDENT',
      status: 'active',
      email_verified: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true });

    // Create student profile
    await queryInterface.bulkInsert('profiles', [{
      user_id: studentUser[0].id,
      first_name: 'Jane',
      last_name: 'Student',
      phone: '+254700000002',
      gender: 'female',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create programs
    const programs = await queryInterface.bulkInsert('programs', [
      {
        name: 'Diploma in Meteorology',
        code: 'DIP-MET',
        description: 'Comprehensive diploma program in meteorological sciences',
        level: 'diploma',
        duration_months: 24,
        total_credits: 120,
        department: 'Meteorology',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Certificate in Weather Observation',
        code: 'CERT-WO',
        description: 'Certificate program for weather observers',
        level: 'certificate',
        duration_months: 12,
        total_credits: 60,
        department: 'Meteorology',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });

    // Create student record
    await queryInterface.bulkInsert('students', [{
      user_id: studentUser[0].id,
      student_no: 'STU001',
      admission_date: '2024-01-01',
      program_id: programs[0].id,
      status: 'active',
      enrollment_year: 2024,
      expected_graduation_date: '2025-12-31',
      created_at: new Date(),
      updated_at: new Date()
    }]);

    // Create courses
    const courses = await queryInterface.bulkInsert('courses', [
      {
        program_id: programs[0].id,
        code: 'MET101',
        title: 'Introduction to Meteorology',
        description: 'Basic concepts in meteorological sciences',
        credits: 3,
        semester: 1,
        year: 1,
        course_type: 'core',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        program_id: programs[0].id,
        code: 'MET102',
        title: 'Weather Systems',
        description: 'Study of weather systems and patterns',
        credits: 3,
        semester: 1,
        year: 1,
        course_type: 'core',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ], { returning: true });

    // Create class sections
    await queryInterface.bulkInsert('class_sections', [
      {
        course_id: courses[0].id,
        lecturer_id: 1,
        section_code: 'MET101-A',
        room: 'Lab 1',
        capacity: 30,
        current_enrollment: 1,
        schedule: JSON.stringify({
          monday: { start: '09:00', end: '11:00' },
          wednesday: { start: '09:00', end: '11:00' }
        }),
        academic_year: '2024/2025',
        semester: 'first',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create fee structures
    await queryInterface.bulkInsert('fee_structures', [
      {
        program_id: programs[0].id,
        item: 'Tuition Fee',
        description: 'Semester tuition fee',
        amount_kes: 50000.00,
        is_mandatory: true,
        due_date: '2024-02-01',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        program_id: programs[0].id,
        item: 'Registration Fee',
        description: 'Annual registration fee',
        amount_kes: 5000.00,
        is_mandatory: true,
        due_date: '2024-01-15',
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create library items
    await queryInterface.bulkInsert('library_items', [
      {
        isbn: '9780123456789',
        title: 'Introduction to Meteorology',
        authors: JSON.stringify(['Dr. Weather Expert', 'Prof. Climate Scientist']),
        type: 'book',
        copies_total: 5,
        copies_available: 5,
        publisher: 'Meteorology Press',
        publication_year: 2020,
        subject: 'Meteorology',
        location: 'Shelf A1',
        status: 'available',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        isbn: '9780987654321',
        title: 'Weather Forecasting Techniques',
        authors: JSON.stringify(['Dr. Forecast Master']),
        type: 'book',
        copies_total: 3,
        copies_available: 3,
        publisher: 'Weather Publications',
        publication_year: 2021,
        subject: 'Weather Forecasting',
        location: 'Shelf A2',
        status: 'available',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    // Create research projects
    await queryInterface.bulkInsert('research_projects', [
      {
        title: 'Climate Change Impact on Kenyan Agriculture',
        lead_lecturer_id: 1,
        sponsor: 'Ministry of Agriculture',
        start_date: '2024-01-01',
        end_date: '2025-12-31',
        status: 'active',
        description: 'Research on climate change effects on agricultural productivity',
        budget: 1000000.00,
        deliverables: JSON.stringify(['Research Report', 'Policy Recommendations']),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);

    console.log('Demo data seeded successfully!');
  },

  async down(queryInterface, Sequelize) {
    // Remove all seeded data
    await queryInterface.bulkDelete('project_members', null, {});
    await queryInterface.bulkDelete('research_projects', null, {});
    await queryInterface.bulkDelete('loans', null, {});
    await queryInterface.bulkDelete('library_items', null, {});
    await queryInterface.bulkDelete('fee_structures', null, {});
    await queryInterface.bulkDelete('class_sections', null, {});
    await queryInterface.bulkDelete('courses', null, {});
    await queryInterface.bulkDelete('students', null, {});
    await queryInterface.bulkDelete('lecturers', null, {});
    await queryInterface.bulkDelete('programs', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
