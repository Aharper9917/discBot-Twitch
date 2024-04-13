require('module-alias/register')
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

try {
  const isForce = !!process.argv.slice(2)[0]
  const options = { alter: true, force: isForce }
  console.log('options', options)
  console.log(`Started syncing Database Models.`)

  Guild.sync(options)
  Notification.sync(options)
  
  console.log(`Successfully Synced Database Models.`)  
} catch (error) {
  console.log(error)
}
