const {  DataTypes } = require('sequelize');
const sequelize = require('../../db.js');

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
    purchasePrice: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },
    averageCost: {
        type: DataTypes.FLOAT,
        defaultValue: 0 
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0 
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Categories', // 'Categories' se refiere al nombre de la tabla, no al modelo
            key: 'id',
        }
    }, 
    brandId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Brands', // 'Brands' se refiere al nombre de la tabla, no al modelo
            key: 'id',
        }
    } 
}, {
    paranoid: true
});


module.exports = Product;