const { DataTypes } = require('sequelize');
const sequelize = require('../../db.js');
const Sale = require('../models/sale.model.js'); 
const Product = require('../models/product.model.js'); 

const DetailSale = sequelize.define('DetailSale', {
    saleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Sale, // Ahora Sale es el modelo requerido
        key: 'id'
      }
    },
    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Product, // Ahora Product es el modelo requerido
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
  }, {
    paranoid: true,
});
  
module.exports = DetailSale;