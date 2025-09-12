const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ProjectMember extends Model {
    static associate(models) {
      ProjectMember.belongsTo(models.ResearchProject, {
        foreignKey: 'project_id',
        as: 'project'
      });
      ProjectMember.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  ProjectMember.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    project_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'research_projects', key: 'id' } },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    role: { type: DataTypes.ENUM('lead', 'co_investigator', 'researcher', 'assistant'), allowNull: false, defaultValue: 'researcher' },
    joined_at: { type: DataTypes.DATE, allowNull: false }
  }, {
    sequelize,
    modelName: 'ProjectMember',
    tableName: 'project_members',
    timestamps: true,
    underscored: true,
    indexes: [
      { unique: true, fields: ['project_id', 'user_id'] }
    ]
  });

  return ProjectMember;
};
