const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
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
  const target = interaction.options.getUser('target') ?? interaction.user;
  console.log(target)

  await interaction.reply(`User: \`${target.username}\`\nID: \`${target.id}\`\nBot: \`${target.bot.toString()}\``);
}

const execute = async (interaction) => {
  const command = interaction.options.getSubcommand();

  switch (command) {
    case 'user':
      await user(interaction);
      break;
    case 'server':
      await interaction.reply(`This server is ${interaction.guild.name} and has ${interaction.guild.memberCount} members.`);
      break;
  }
}

module.exports = {data, execute}