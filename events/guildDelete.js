const { Events } = require('discord.js');

const execute = async (guild) => {
  console.log("Left a guild: " + guild.name);
  // Remove from Guild DB table
}

module.exports = {
	name: Events.GuildDelete,
	once: false,
	execute
};
