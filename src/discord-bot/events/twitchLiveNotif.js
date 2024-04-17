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
  try {
    console.log('CLIENT', client)
    console.log('client.liveEvent', client.liveEvent)
    const dbNotifs = await Notification.findAll({ where: {
      twitchUsername: client.liveEvent.broadcaster_user_login
    }})
  
    for (const notif of dbNotifs) {
      const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: notif.guildId } })
      console.log('notif', notif)
      console.log('dbGuild', dbGuild)
      
      client.channels.cache.get(dbGuild.notificationChannelId).send(
        `## <@${notif.discordUserId}> just went live on Twitch!\n${notif.twitchUrl}`
      );
    }
  } catch (error) {
    console.log(error)    
  }
}

module.exports = {
	name: 'twitch-live-notification',
	once: false,
	execute
};
