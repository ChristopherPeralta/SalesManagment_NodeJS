const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db.js');
const Product = require('./Product'); // Importa el modelo Product

const Category = sequelize.define('Category', {
    // Define tus campos aquí
});

module.exports = Category;

sequelize.sync()
  .then(() => console.log('Tablas creadas'))
  .catch(error => console.log('Error al crear las tablas:', error));