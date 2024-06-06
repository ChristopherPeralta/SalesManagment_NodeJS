const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db.js');
const Category = require('./Category');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // 'Categories' se refiere al nombre de la tabla, no al modelo
            key: 'id',
        }
        
    }
}, {
    paranoid: true
});

module.exports = Product;

sequelize.sync()
  .then(() => console.log('Tablas creadas'))
  .catch(error => console.log('Error al crear las tablas:', error));