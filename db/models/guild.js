const Sequelize = require('sequelize')
const db = require('@db/database.js')

const Guild = db.define('guild', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  notificationChannelId: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

module.exports = Guild