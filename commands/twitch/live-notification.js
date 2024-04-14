const { SlashCommandBuilder, ChannelType } = require('discord.js');
const Guild = require('@db/models/guild');
const Notification = require('@db/models/notification');
const { isValidTwitchUrl, getTwitchUsernameFromUrl } = require('@utils/url');
const BotError = require('@errors/BotError');

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

const addNotification = async (interaction) => {
  try {
    await interaction.deferReply({ephemeral: true})
    const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })
    if (dbCreated) await dbGuild.update({ notificationChannelId: interaction.guild.systemChannelId })
    if (!isValidTwitchUrl(interaction.options.getString('url'))) throw new BotError(`Not a valid Twitch Url`)

    await dbGuild.createNotification({
      twitchUrl: interaction.options.getString('url'),
      twitchUsername: await getTwitchUsernameFromUrl(interaction.options.getString('url')),
      discordUserId: interaction.options.getUser('user').id
    })
  
    await interaction.editReply(
      `Successfully added!\n\n` +
      `${interaction.options.getUser('user')}'s Twitch Live notifications will appear in ${interaction.guild.channels.cache.get(dbGuild.notificationChannelId)}\n` +
      `${interaction.options.getString('url')}`
    )
  } catch (error) {
    console.error(error)
    interaction.editReply(error.botMessage ? error.botMessage : "Unexpected error occured.")
  }
}

const removeNotification = async (interaction) => {}

const listNotification = async (interaction) => {
  try {
    await interaction.deferReply({ephemeral: true})
    const dbNotification = await Notification.findAll({ where: { guildId: interaction.guild.id } })

    let reply = dbNotification.length === 0
      ? "### There are no Twitch Live Notifications.\nUse: `/live-notification add`"
      : "### Twitch Live Notifications:\n"
    
    for (const [i, notif] of dbNotification.entries()) {
      // const active = `${ !notif.active ? ':red_circle:' : ':o:'}`
      const active = `${ notif.active ? ':white_check_mark:' : ':white_square_button:'}`
      const discordUser = `${interaction.guild.members.cache.get(notif.discordUserId)}`
      const twitchInfo = `Twitch: [${notif.twitchUsername}](<${notif.twitchUrl}>)`

      reply = reply + `- ${active}  ${discordUser} - ${twitchInfo}\n`
    }
  
    await interaction.editReply(reply)
  } catch (error) {
    console.error(error)
    interaction.editReply(error.botMessage ? error.botMessage : "Unexpected error occured.")
  }

}

const toggleNotification = async (interaction) => {}

const execute = async (interaction) => {
  const command = interaction.options.getSubcommand();

  switch (command) {
    case 'add-modal':
      const modal = require('@modals/twitch-notifications');
      await modal.show(interaction);      
      break;
    case 'add':
      await addNotification(interaction)
      break;
    case 'remove':
      await removeNotification(interaction)
      break;
    case 'list':
      await listNotification(interaction)
      break;
    case 'toggle':
      await toggleNotification(interaction)
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