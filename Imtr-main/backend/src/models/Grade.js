const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Grade extends Model {
    static associate(models) {
      Grade.belongsTo(models.Assessment, {
        foreignKey: 'assessment_id',
        as: 'assessment'
      });
      Grade.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student'
      });
    }
  }

  Grade.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assessment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'assessments', key: 'id' },
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
    score: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false
    },
    letter_grade: {
      type: DataTypes.STRING(5),
      allowNull: true
    },
    graded_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    graded_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'lecturers', key: 'id' }
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Grade',
    tableName: 'grades',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['assessment_id', 'student_id'] },
      { fields: ['student_id'] },
      { fields: ['graded_at'] }
    ]
  });

  return Grade;
};
