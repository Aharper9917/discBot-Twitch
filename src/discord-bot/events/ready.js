const { Events } = require('discord.js');
const { deployCommands } = require('@discord-bot/utils/deploy-commands');

const execute = async (client) => {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  await deployCommands();
}

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute
};
