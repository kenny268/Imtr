const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LibraryItem extends Model {
    static associate(models) {
      LibraryItem.hasMany(models.Loan, {
        foreignKey: 'library_item_id',
        as: 'loans'
      });
    }
  }

  LibraryItem.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isbn: { type: DataTypes.STRING(20), allowNull: true },
    title: { type: DataTypes.STRING(255), allowNull: false },
    authors: { type: DataTypes.JSON, allowNull: true, defaultValue: [] },
    type: { type: DataTypes.ENUM('book', 'journal', 'thesis', 'reference', 'digital'), allowNull: false, defaultValue: 'book' },
    copies_total: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    copies_available: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    publisher: { type: DataTypes.STRING(255), allowNull: true },
    publication_year: { type: DataTypes.INTEGER, allowNull: true },
    subject: { type: DataTypes.STRING(100), allowNull: true },
    location: { type: DataTypes.STRING(100), allowNull: true },
    status: { type: DataTypes.ENUM('available', 'unavailable', 'maintenance'), allowNull: false, defaultValue: 'available' }
  }, {
    sequelize,
    modelName: 'LibraryItem',
    tableName: 'library_items',
    timestamps: true,
    underscored: true
  });

  return LibraryItem;
};
