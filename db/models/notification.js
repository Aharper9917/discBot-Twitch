const Sequelize = require('sequelize')
const db = require('@db/database.js')

const Notification = db.define('notification', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    primaryKey: true
  },
  twitchUrl: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  twitchUsername: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  discordUserId: {
    type: Sequelize.STRING,
    allowNull: true
  },
  active: {
    type: Sequelize.BOOLEAN,
    defaultValue: true,
    allowNull: false
  }
  // guildId from Notification.belongsTo(Guild)
})

module.exports = Notification