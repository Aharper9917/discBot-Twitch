/* client.liveEvent. = {
  "id": "9001",
  "broadcaster_user_id": "1337",
  "broadcaster_user_login": "cool_user",
  "broadcaster_user_name": "Cool_User",
  "type": "live",
  "started_at": "2020-10-11T10:11:12.123Z"
} */
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')
const { GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventStatus } = require('discord.js');


const execute = async (client) => {
  console.log('stream.online', client.liveEvent)
  try {
    const dbNotifs = await Notification.findAll({ where: { twitchUsername: client.liveEvent.broadcaster_user_login } })
    
    for (const notif of dbNotifs) {
      if (!notif.active) break;
      try {
        const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: notif.guildId } })
        const guild = client.guilds.cache.get(notif.guildId);
        const event_manager = new GuildScheduledEventManager(guild);

        const event = await event_manager.create({
          name: `🚨🚨 ${client.liveEvent.broadcaster_user_name} is Live!! 🚨🚨`, // TODO get Twitch live name
          scheduledStartTime: new Date(Date.now() + 1000),
          scheduledEndTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
          privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
          entityType: GuildScheduledEventEntityType.External,
          description: notif.twitchUrl,
          entityMetadata: {
            location: notif.twitchUrl,
            test: 'test'
          },
        });

        event.setStatus(GuildScheduledEventStatus.Active)
        client.channels.cache.get(dbGuild.notificationChannelId).send(
          `## <@${notif.discordUserId}> just went live on Twitch!\n${notif.twitchUrl}`
        );
      } catch (error) {
        console.log(`Error in GuildID: ${notif.guildId}\n`, error)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = {
  name: 'twitch-live-online',
  once: false,
  execute
};
