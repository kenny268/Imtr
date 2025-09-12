const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Loan extends Model {
    static associate(models) {
      Loan.belongsTo(models.LibraryItem, {
        foreignKey: 'library_item_id',
        as: 'libraryItem'
      });
      Loan.belongsTo(models.User, {
        foreignKey: 'borrower_user_id',
        as: 'borrower'
      });
    }
  }

  Loan.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    library_item_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'library_items', key: 'id' } },
    borrower_user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    borrowed_at: { type: DataTypes.DATE, allowNull: false },
    due_at: { type: DataTypes.DATE, allowNull: false },
    returned_at: { type: DataTypes.DATE, allowNull: true },
    fine_kes: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
    status: { type: DataTypes.ENUM('active', 'returned', 'overdue', 'lost'), allowNull: false, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'Loan',
    tableName: 'loans',
    timestamps: true,
    underscored: true
  });

  return Loan;
};
