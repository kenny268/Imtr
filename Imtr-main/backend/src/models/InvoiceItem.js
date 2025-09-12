const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class InvoiceItem extends Model {
    static associate(models) {
      InvoiceItem.belongsTo(models.Invoice, {
        foreignKey: 'invoice_id',
        as: 'invoice'
      });
    }
  }

  InvoiceItem.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    invoice_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'invoices', key: 'id' } },
    item: { type: DataTypes.STRING(255), allowNull: false },
    amount_kes: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'InvoiceItem',
    tableName: 'invoice_items',
    timestamps: true,
    underscored: true
  });

  return InvoiceItem;
};
