const { Events } = require('discord.js');

const execute = async (guild) => {
  console.log("Joined a new guild: " + guild.name);
  // Add to guild DB table
}

module.exports = {
	name: Events.GuildCreate,
	once: false,
	execute
};
