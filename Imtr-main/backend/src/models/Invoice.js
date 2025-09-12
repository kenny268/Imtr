const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      Invoice.belongsTo(models.Student, {
        foreignKey: 'student_id',
        as: 'student'
      });
      Invoice.hasMany(models.InvoiceItem, {
        foreignKey: 'invoice_id',
        as: 'items'
      });
      Invoice.hasMany(models.Payment, {
        foreignKey: 'invoice_id',
        as: 'payments'
      });
    }
  }

  Invoice.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    student_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'students', key: 'id' } },
    invoice_number: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    total_kes: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'cancelled'), allowNull: false, defaultValue: 'pending' },
    notes: { type: DataTypes.TEXT, allowNull: true }
  }, {
    sequelize,
    modelName: 'Invoice',
    tableName: 'invoices',
    timestamps: true,
    underscored: true
  });

  return Invoice;
};
