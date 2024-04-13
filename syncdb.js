require('module-alias/register')
const db = require('@db/database')
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

try {
  console.log(`Started syncing Database Models.`)
  
  Guild.sync({force: true})
  Notification.sync({force: true})
  db.sync({ force: true })
  
  console.log(`Successfully Synced Database Models.`)  
} catch (error) {
  console.log(error)
}
