/* client.liveEvent. = {
  "broadcaster_user_id": "1337",
  "broadcaster_user_login": "cool_user",
  "broadcaster_user_name": "Cool_User"
} */
const Notification = require('@db/models/notification')
const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventStatus } = require('discord.js');


const execute = async (client) => {
  console.log('stream.offline', client.liveEvent)
  try {
    const dbNotifs = await Notification.findAll({ where: { twitchUsername: client.liveEvent.broadcaster_user_login } })

    for (const notif of dbNotifs) {
      try {
        const guild = client.guilds.cache.get(notif.guildId);
        const event_manager = new GuildScheduledEventManager(guild);

        const events = (await event_manager.fetch()).filter((event) => event.entityMetadata.location === notif.twitchUrl);
        events.forEach(event => {
          event.setStatus(GuildScheduledEventStatus.Completed)
        });
      } catch (error) {
        console.log(`GuildID: ${notif.guildId}`, error.rawError)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  name: 'twitch-live-offline',
  once: false,
  execute
};
