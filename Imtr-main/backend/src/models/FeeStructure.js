const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class FeeStructure extends Model {
    static associate(models) {
      FeeStructure.belongsTo(models.Program, {
        foreignKey: 'program_id',
        as: 'program'
      });
    }
  }

  FeeStructure.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    program_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'programs', key: 'id' } },
    item: { type: DataTypes.STRING(255), allowNull: false },
    amount_kes: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    is_mandatory: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    due_date: { type: DataTypes.DATEONLY, allowNull: true },
    status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' }
  }, {
    sequelize,
    modelName: 'FeeStructure',
    tableName: 'fee_structures',
    timestamps: true,
    underscored: true
  });

  return FeeStructure;
};
