const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const execute = async (interaction) => {
  await interaction.deferReply({ephemeral: true})
  interaction.editReply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
}

module.exports = {
  disabled: true,
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Provides information about the user.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
	execute,
};