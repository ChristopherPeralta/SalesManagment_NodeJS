const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db.js')

const Sale = sequelize.define('Sale', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  paranoid: true,
});

module.exports = Sale;