const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('live-notifications')
  .setDescription(`Modify what Twitch users you'll get live notifications for.`)
  .addSubcommand(subcommand =>
		subcommand
			.setName('add-modal')
			.setDescription('Show Modal to Add new live notificaiton')
    )
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add a new Twitch live notification')
      .addStringOption(option => option.setName('url').setDescription(`The User's Twitch URL`))
      .addUserOption(option => option.setName('user').setDescription('The Discord User'))
      .addChannelOption(option => option.setName('channel').setDescription('The channel you want to get notified in.'))
    )
  .addSubcommand(subcommand => 
    subcommand
      .setName('remove')
      .setDescription('Remove a live notifications.')
    )
  .addSubcommand(subcommand => 
    subcommand
      .setName('toggle')
      .setDescription('Toggle a live notifications.')
    )
  .addSubcommand(subcommand => 
    subcommand
      .setName('list')
      .setDescription('List live notifications.')
    )



const execute = async (interaction) => {
  const command = interaction.options.getSubcommand();

  switch (command) {
    case 'add-modal':
      const modal = require('@modals/twitch-notifications');
      await modal.show(interaction);      
      break;
    case 'add':
      await interaction.reply(`Successfully added!\n\n${interaction.options.getUser('user')}'s Twitch Live notifications will appear in ${interaction.options.getChannel('channel')}`)
      break;
  
    default:
      break;
  }
}

module.exports = {
  cooldown: 1,
	data,
  execute
};