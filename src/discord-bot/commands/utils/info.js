const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setDMPermission(false)
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server'));


const user = async (interaction) => {
  await interaction.deferReply({ephemeral: true})

  const target = interaction.options.getUser('target') ?? interaction.user;
  console.log(target)

  interaction.editReply(`User: \`${target.username}\`\nID: \`${target.id}\`\nBot: \`${target.bot.toString()}\``);
}

const server = async (interaction) => {
  await interaction.deferReply({ephemeral: true})
  interaction.editReply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
}


const execute = async (interaction) => {
  const command = interaction.options.getSubcommand();

  switch (command) {
    case 'user':
      await user(interaction);
      break;
    case 'server':
      await server(interaction);
      break;
  }
}

module.exports = {
  disabled: true,
  data,
  execute
}