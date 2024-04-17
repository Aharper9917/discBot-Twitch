const { SlashCommandBuilder, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType, GuildScheduledEventStatus } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('live')
  .setDescription('List streams that are Live from your notification list.');

const execute = async (interaction) => {
  await interaction.deferReply({ephemeral: true})

  await interaction.editReply('Not implemented!');
}

module.exports = {
  cooldown: 5,
	data,
	execute,
};