const Sequelize = require("sequelize");

// const db = new Sequelize("database", "username", "password", {
//   host: "localhost",
//   dialect: "sqlite",
//   storage: "data/database.sqlite",
//   logging: false,
// });





console.log(process.env.DATABASE)
console.log(process.env.DB_USER)
console.log(process.env.DB_HOST)
console.log(process.env.DB_PORT)



const db = new Sequelize(
  process.env.DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mariadb",
  }
);

module.exports = db;
