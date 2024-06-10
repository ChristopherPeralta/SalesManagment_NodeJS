const { DataTypes } = require('sequelize');
const sequelize = require('../../db.js');

const Brand = sequelize.define('Brand', {
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

module.exports = Brand;