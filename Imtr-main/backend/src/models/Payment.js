const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });
    }
  }

  Payment.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoice_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'invoices', key: 'id' } },
    amount_kes: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    method: { type: DataTypes.ENUM('mpesa', 'card', 'bank_transfer', 'cash'), allowNull: false },
    mpesa_ref: { type: DataTypes.STRING(100), allowNull: true },
    transaction_id: { type: DataTypes.STRING(100), allowNull: true },
    paid_at: { type: DataTypes.DATE, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments',
    timestamps: true,
    underscored: true
  });

  return Payment;
};
