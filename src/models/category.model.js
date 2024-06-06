const { DataTypes } = require('sequelize');
const sequelize = require('../../db.js');

const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
      type: DataTypes.STRING,
      allowNull: false
  }
}, {
  paranoid: true
});

module.exports = Category;