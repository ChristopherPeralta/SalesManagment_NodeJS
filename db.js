const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config(); // Carga las variables de entorno desde el archivo .env

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

sequelize
    .sync()
    .then(() => console.log("DB successfully connection..."))
    .catch((error) => console.log("Error creating tables:", error));
