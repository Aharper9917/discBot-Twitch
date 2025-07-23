const Sequelize = require("sequelize");

const sqlitedb = new Sequelize("database", "username", "password", {
  host: "localhost",
  dialect: "sqlite",
  storage: "data/database.sqlite",
  logging: false,
});

const mariadb = new Sequelize({
  dialect: MariaDbDialect,
  database: process.env.DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  showWarnings: true,
  connectTimeout: 1000,
});

module.exports =
  process.env.DATABASE_TYPE == "mariadb"
    ? mariadb
    : process.env.DATABASE_TYPE == "sqlite"
    ? sqlitedb
    : null;
