const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResearchProject extends Model {
    static associate(models) {
      ResearchProject.belongsTo(models.Lecturer, {
        foreignKey: 'lead_lecturer_id',
        as: 'leadLecturer'
      });
      ResearchProject.belongsToMany(models.User, {
        through: models.ProjectMember,
        foreignKey: 'project_id',
        as: 'members'
      });
    }
  }

  ResearchProject.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    lead_lecturer_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'lecturers', key: 'id' } },
    sponsor: { type: DataTypes.STRING(255), allowNull: true },
    start_date: { type: DataTypes.DATEONLY, allowNull: false },
    end_date: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.ENUM('planning', 'active', 'completed', 'cancelled'), allowNull: false, defaultValue: 'planning' },
    description: { type: DataTypes.TEXT, allowNull: true },
    budget: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
    deliverables: { type: DataTypes.JSON, allowNull: true, defaultValue: [] }
  }, {
    sequelize,
    modelName: 'ResearchProject',
    tableName: 'research_projects',
    timestamps: true,
    underscored: true
  });

  return ResearchProject;
};
