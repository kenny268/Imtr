const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    static associate(models) {
      Attendance.belongsTo(models.ClassSection, {
        foreignKey: 'class_section_id',
        as: 'classSection'
      });
      Attendance.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student'
      });
    }
  }

  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    class_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'class_sections', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'students', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('present', 'absent', 'late', 'excused'),
      allowNull: false,
      defaultValue: 'absent'
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Attendance',
    tableName: 'attendance',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['class_section_id', 'student_id', 'date'] },
      { fields: ['date'] },
      { fields: ['status'] }
    ]
  });

  return Attendance;
};
