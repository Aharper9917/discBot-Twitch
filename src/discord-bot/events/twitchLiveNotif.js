/* client.liveEvent = {
  "id": "50897254045",
  "broadcaster_user_id": "2341234234",
  "broadcaster_user_login": "asdfasdf",
  "broadcaster_user_name": "asdfasdf",
  "type": "live",
  "started_at": "2024-04-17T03:24:58Z"
} */
const Guild = require('@db/models/guild')
const Notification = require('@db/models/notification')

const execute = async (client) => {
  const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: clients.guild.id } })
  const dbNotif = await Notification.findOne({ where: {
    guildId: client.guild.id,
    twitchUsername: client.liveEvent.broadcaster_user_login
  }})

  client.channels.cache.get(dbGuild.notificationChannelId).send(`<@everyone> [${dbNotif.twitchUsername}](${dbNotif.twitchUrl}) just went live on Twitch!\n\n`);
}

module.exports = {
	name: 'twitch-live-notification',
	once: false,
	execute
};
