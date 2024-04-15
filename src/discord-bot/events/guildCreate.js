const { Events } = require('discord.js');
const Guild = require('@db/models/guild');

const execute = async (guild) => {
  console.log("Joined a new guild: " + guild.name);

  // Add to guild DB table
  const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: guild.id } })
  await dbGuild.update({ notificationChannelId: guild.systemChannelId })
}

module.exports = {
	name: Events.GuildCreate,
	once: false,
	execute
};
