const fs = require('node:fs');
const path = require('node:path');
const db = require('@db/database')
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

// Associations
Guild.hasMany(Notification)
Notification.belongsTo(Guild)

// Sync Models
const modelRootPath = path.join(__dirname, 'models');
const modelFiles = fs.readdirSync(modelRootPath).filter(file => file.endsWith('.js'))

console.log(`Started syncing ${modelFiles.length} Database Models.`)
// for (const file of modelFiles) {
//   const filePath = path.join(modelRootPath, file);
//   const model = require(filePath);

//   model.sync({alter: true})
//   // model.sync({force: true})
// }
// db.drop()
db.sync({ alter: true })
// db.sync({ force: true })
console.log(`Successfully Synced ${modelFiles.length} Database Models.`)
