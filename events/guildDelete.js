const { Events } = require('discord.js');
const Guild = require('@db/models/guild');

const execute = async (guild) => {
  console.log("Left a guild: " + guild.name);
  
  // Remove from Guild DB table
  const dbGuild = await Guild.findByPk(guild.id)
  await dbGuild.destroy()
}

module.exports = {
	name: Events.GuildDelete,
	once: false,
	execute
};
