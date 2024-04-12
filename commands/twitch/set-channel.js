const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('set-channel')
  .setDescription('List streams that are Live from your notification list.')
  .addChannelOption(option => option // TODO Remove with db change
    .setName('channel')
    .setDescription('The channel you want to get notified in.')
    .addChannelTypes(ChannelType.GuildText)
  )
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)

const execute = async (interaction) => {
  // TODO set guild's notifications channel in DB
  await interaction.reply('Not implemented!');
}

module.exports = {
  cooldown: 5,
	data,
	execute,
};