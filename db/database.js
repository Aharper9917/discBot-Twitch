const Sequelize = require("sequelize");

let db;

if (process.env.DATABASE_TYPE == "sqlite") {
  db = new Sequelize("database", "username", "password", {
    host: "localhost",
    dialect: "sqlite",
    storage: "data/database.sqlite",
    logging: false,
  });
} else if (process.env.DATABASE_TYPE == "mariadb") {
  db = new Sequelize("database", "username", "password", {
    dialect: "mariadb",
    dialectOptions: {
      database: process.env.DATABASE,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      showWarnings: true,
      connectTimeout: 1000,
    },
  });
}

module.exports = db;
