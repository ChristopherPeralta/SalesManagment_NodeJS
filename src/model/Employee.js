const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../../db.js')

const Employee = sequelize.define('Employee', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: false
    },
    salary: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    // Opciones adicionales
    paranoid: true
});

module.exports = Employee;

sequelize.sync()
  .then(() => console.log('Tablas creadas'))
  .catch(error => console.log('Error al crear las tablas:', error));