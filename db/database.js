const Sequelize = require("sequelize");

// const db = new Sequelize("database", "username", "password", {
//   host: "localhost",
//   dialect: "sqlite",
//   storage: "data/database.sqlite",
//   logging: false,
// });

const db = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    dialect: "mariadb",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialectOptions: {
      showWarnings: true,
      connectTimeout: 1000, // Timeout in milliseconds
    },
  }
);

module.exports = db;
