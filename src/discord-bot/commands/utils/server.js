const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

const execute =  async (interaction) => {
  await interaction.deferReply({ephemeral: true})
  interaction.editReply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
}

module.exports = {
  disabled: true,
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Provides information about the server.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
	execute,
};