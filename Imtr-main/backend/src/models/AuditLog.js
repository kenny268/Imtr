const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AuditLog extends Model {
    static associate(models) {
      AuditLog.belongsTo(models.User, {
        foreignKey: 'actor_user_id',
        as: 'actor'
      });
    }
  }

  AuditLog.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    actor_user_id: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
    action: { type: DataTypes.STRING(100), allowNull: false },
    entity: { type: DataTypes.STRING(100), allowNull: false },
    entity_id: { type: DataTypes.INTEGER, allowNull: true },
    old_values: { type: DataTypes.JSON, allowNull: true },
    new_values: { type: DataTypes.JSON, allowNull: true },
    ip: { type: DataTypes.STRING(45), allowNull: true },
    user_agent: { type: DataTypes.TEXT, allowNull: true },
    created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
  }, {
    sequelize,
    modelName: 'AuditLog',
    tableName: 'audit_logs',
    timestamps: false,
    underscored: true,
    indexes: [
      { fields: ['actor_user_id'] },
      { fields: ['action'] },
      { fields: ['entity'] },
      { fields: ['created_at'] }
    ]
  });

  return AuditLog;
};
