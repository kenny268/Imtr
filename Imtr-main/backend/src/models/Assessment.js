const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assessment extends Model {
    static associate(models) {
      Assessment.belongsTo(models.ClassSection, {
        foreignKey: 'class_section_id',
        as: 'classSection'
      });
      Assessment.belongsTo(models.Lecturer, {
        foreignKey: 'lecturer_id',
        as: 'lecturer'
      });
      Assessment.hasMany(models.Grade, {
        foreignKey: 'assessment_id',
        as: 'grades'
      });
    }
  }

  Assessment.init({
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
    lecturer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lecturers', key: 'id' },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT'
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('assignment', 'quiz', 'midterm', 'final', 'project', 'presentation', 'lab'),
      allowNull: false
    },
    max_score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    weight: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
      validate: { min: 0, max: 100 }
    },
    due_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    instructions: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published', 'grading', 'completed'),
      allowNull: false,
      defaultValue: 'draft'
    }
  }, {
    sequelize,
    modelName: 'Assessment',
    tableName: 'assessments',
    timestamps: true,
    underscored: true,
    indexes: [
      { fields: ['class_section_id'] },
      { fields: ['lecturer_id'] },
      { fields: ['type'] },
      { fields: ['due_date'] }
    ]
  });

  return Assessment;
};
