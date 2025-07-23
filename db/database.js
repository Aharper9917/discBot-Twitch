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
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "mariadb",
  }
);

async function testConnection() {
  try {
    await db.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

testConnection();

module.exports = db;
