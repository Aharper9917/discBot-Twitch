const Sequelize = require('sequelize');

const db = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  storage: 'data/database.sqlite',
  logging: false,
});

module.exports = db