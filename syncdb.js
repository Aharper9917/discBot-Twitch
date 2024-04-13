require('module-alias/register')
require('@db/relations')
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

try {
  const force = !!process.argv.slice(2).includes('force')
  const alter = !!process.argv.slice(2).includes('alter')
  const options = { alter: alter, force: force }
  console.log('options', options)
  console.log(`Started syncing Database Models.`)

  Guild.sync(options)
  Notification.sync(options)
  
  console.log(`Successfully Synced Database Models.`)  
} catch (error) {
  console.log(error)
}
