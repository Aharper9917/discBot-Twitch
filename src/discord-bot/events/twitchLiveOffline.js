/* client.liveEvent. = {
  "broadcaster_user_id": "1337",
  "broadcaster_user_login": "cool_user",
  "broadcaster_user_name": "Cool_User"
} */
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')
const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventStatus } = require('discord.js');


const execute = async (client) => {
  try {
    // TODO get current discord events and end the one associated with stream
  } catch (error) {
    console.log(error)    
  }
}

module.exports = {
	name: 'twitch-live-offline',
	once: false,
	execute
};
