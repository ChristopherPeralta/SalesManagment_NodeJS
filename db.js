const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('db_nodejs', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;