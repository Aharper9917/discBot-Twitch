require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env` })
require('module-alias/register')
require('@db/database')
require('@db/relations')
const { DiscordBot } = require('@discord-bot')


const bot = new DiscordBot()
bot.start()