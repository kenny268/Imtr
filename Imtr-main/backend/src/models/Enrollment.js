const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    static associate(models) {
      Enrollment.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student'
      });
      Enrollment.belongsTo(models.ClassSection, {
        foreignKey: 'class_section_id',
        as: 'classSection'
      });
    }
  }

  Enrollment.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    class_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'class_sections', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    status: {
      type: DataTypes.ENUM('enrolled', 'dropped', 'completed', 'failed'),
      allowNull: false,
      defaultValue: 'enrolled'
    },
    enrollment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    drop_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    final_grade: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    credits_earned: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Enrollment',
    tableName: 'enrollments',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['student_id', 'class_section_id'] },
      { fields: ['status'] },
      { fields: ['enrollment_date'] }
    ]
  });

  return Enrollment;
};
