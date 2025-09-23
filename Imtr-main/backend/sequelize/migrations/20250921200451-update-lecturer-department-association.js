'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Check if department_id column exists, if not add it
    const tableDescription = await queryInterface.describeTable('lecturers');
    
    if (!tableDescription.department_id) {
      await queryInterface.addColumn('lecturers', 'department_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'departments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // Add index for department_id if it doesn't exist
    try {
      await queryInterface.addIndex('lecturers', ['department_id']);
    } catch (error) {
      // Index might already exist, ignore the error
      console.log('Index might already exist:', error.message);
    }

    // Remove the old department string column if it exists
    if (tableDescription.department) {
      await queryInterface.removeColumn('lecturers', 'department');
    }
  },

  async down (queryInterface, Sequelize) {
    // Add back the department string column
    await queryInterface.addColumn('lecturers', 'department', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    // Remove the department_id column and its index
    await queryInterface.removeIndex('lecturers', ['department_id']);
    await queryInterface.removeColumn('lecturers', 'department_id');
  }
};
