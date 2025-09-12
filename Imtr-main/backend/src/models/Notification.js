const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
    }
  }

  Notification.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    channel: { type: DataTypes.ENUM('email', 'sms', 'in_app', 'push'), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    body: { type: DataTypes.TEXT, allowNull: false },
    sent_at: { type: DataTypes.DATE, allowNull: true },
    read_at: { type: DataTypes.DATE, allowNull: true },
    status: { type: DataTypes.ENUM('pending', 'sent', 'delivered', 'failed'), allowNull: false, defaultValue: 'pending' },
    meta_json: { type: DataTypes.JSON, allowNull: true, defaultValue: {} }
  }, {
    sequelize,
    modelName: 'Notification',
    tableName: 'notifications',
    timestamps: true,
    underscored: true
  });

  return Notification;
};
