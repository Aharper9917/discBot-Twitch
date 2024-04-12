const db = require('@db/database')
const Guild = require('@db/models/guild')

Guild.sync({alter: true})
// Guild.sync({force: true})