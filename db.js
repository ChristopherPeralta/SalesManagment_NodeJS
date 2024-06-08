const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
const mysql = require('mysql2/promise');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
  }
);

module.exports = sequelize;

(async () => {
  // Primero, creamos una conexion sin bd
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  // Luego, creamos la base de datos si no existe
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

  sequelize
    .sync()
    .then(() => console.log("DB successfully connection..."))
    .catch((error) => console.log("Error creating tables:", error));
})();