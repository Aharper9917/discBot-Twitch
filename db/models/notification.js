const Sequelize = require('sequelize')
const db = require('@db/database.js')
const Guild = require('@db/models/guild')


const Notification = db.define('notification', {
  id: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  guidlId: {
    type: Sequelize.STRING,
    primaryKey: true
  },
  twitchUrl: {
    type: Sequelize.STRING,
    allowNull: false
  },
  twitchUsername: {
    type: Sequelize.STRING,
    allowNull: false
  },
  discordUserId: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Notification.hasOne(Guild)

module.exports = Notification