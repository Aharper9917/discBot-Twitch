const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('bing')
  .setDescription('Replies with Pong!');

const execute = async (interaction) => {
  await interaction.reply('bong!');
}

module.exports = {
  cooldown: 5,
	data,
	execute,
};