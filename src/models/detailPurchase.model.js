const { DataTypes } = require('sequelize');
const sequelize = require('../../db.js');

const DetailPurchase = sequelize.define('DetailPurchase', {
  purchaseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Purchases', // nombre de la tabla, no del modelo
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products', // nombre de la tabla, no del modelo
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
});

module.exports = DetailPurchase;