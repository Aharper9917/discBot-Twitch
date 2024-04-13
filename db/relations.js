const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

Guild.hasMany(Notification)
Notification.belongsTo(Guild)