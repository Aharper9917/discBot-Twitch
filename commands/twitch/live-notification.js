const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Guild = require('@db/models/guild');
const { isValidTwitchUrl, getTwitchUsernameFromUrl } = require('@utils/url')

const data = new SlashCommandBuilder()
  .setName('live-notification')
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

const add = async (interaction) => {
  try {
    await interaction.deferReply({ephemeral: true})
    const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })
    if (dbCreated) { await dbGuild.update({ notificationChannelId: interaction.guild.systemChannelId }) }  
  
    await dbGuild.createNotification({
      twitchUrl: interaction.options.getString('url'),
      twitchUsername: await getTwitchUsernameFromUrl(interaction.options.getString('url')),
      discordUserId: interaction.options.getUser('user').id
    })
  
    interaction.editReply(
      `Successfully added!\n\n` +
      `${interaction.options.getUser('user')}'s Twitch Live notifications will appear in ${interaction.guild.channels.cache.get(dbGuild.notificationChannelId)}\n` +
      `${interaction.options.getString('url')}`
    )
  } catch (error) {
    console.error(error)
    interaction.editReply(error.message)
  }
}

const execute = async (interaction) => {
  const command = interaction.options.getSubcommand();

  switch (command) {
    case 'add-modal':
      const modal = require('@modals/twitch-notifications');
      await modal.show(interaction);      
      break;
    case 'add':
      await add(interaction)
      break;
  
    default:
      await interaction.reply('Not implemented!');
      break;
  }
}

module.exports = {
  cooldown: 1,
	data,
  execute
};