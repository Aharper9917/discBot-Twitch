const {
  SlashCommandBuilder,
  ActionRowBuilder,
  ComponentType,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require('discord.js');
const Guild = require('@db/models/guild');
const Notification = require('@db/models/notification');
const { isValidTwitchUrl, getTwitchUsernameFromUrl } = require('@utils/url');
const BotError = require('@errors/BotError');

const data = new SlashCommandBuilder()
  .setName('live-notification')
  .setDescription(`Modify what Twitch users you'll get live notifications for.`)
  // .addSubcommand(subcommand =>
	// 	subcommand
	// 		.setName('add-modal')
	// 		.setDescription('Show Modal to Add new live notificaiton')
  //   )
  .addSubcommand(subcommand =>
    subcommand
      .setName('add')
      .setDescription('Add a new Twitch live notification')
      .addStringOption(option => option.setName('url').setDescription(`The User's Twitch URL`))
      .addUserOption(option => option.setName('user').setDescription('The Discord User'))
    )
  .addSubcommand(subcommand => 
    subcommand
      .setName('view')
      .setDescription('Modify a live notifications.')
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

const modifyNotification = async (interaction) => {
  const res = await interaction.deferReply({ephemeral: true})
  const resContent = {
    content: "",
    components: []
  }
  
  try {
    // ==================================== Build Initial Dialog ====================================
    const dbNotifs = await Notification.findAll({ where: { guildId: interaction.guild.id } })
    let selection
    
    if (dbNotifs.length === 0) {
      resContent.content = resContent.content + "### There are no Twitch Live Notifications.\nUse: `/live-notification add`"
    }
    else {
      resContent.content = resContent.content + "### Twitch Live Notifications:\n"
      const options = []
      
      for (const [i, notif] of dbNotifs.entries()) {
        const active = `${ notif.active ? '✅' : '🔳'}`
        const discordUser = `<@${notif.discordUserId}>`
        const twitchInfo = `Twitch: [${notif.twitchUsername}](<${notif.twitchUrl}>)`
  
        const option = new StringSelectMenuOptionBuilder()
          .setLabel(`Twitch: ${notif.twitchUrl}`)
          .setValue(`${notif.id}`)
          .setEmoji(`${active}`)
  
        
        options.push(option)
        resContent.content = resContent.content + `- ${active}  ${discordUser} - ${twitchInfo}\n`
      }
    
      // Notification Select Menu Builder
      const select = new StringSelectMenuBuilder()
        .setCustomId('notification-select')
        .setPlaceholder('Select a notificaiton to toggle or delete it.')
        .addOptions(...options);
      const selectRow = new ActionRowBuilder()
        .addComponents(select);
  
      resContent.components.push(selectRow)
    }
    
    await interaction.editReply(resContent)


    // ==================================== Select Menu Collection ====================================
    const collector = res.createMessageComponentCollector({ componentType: ComponentType.StringSelect });

    collector.on('collect', async (i) => {
      selection = i.values[0];

      const deleteBtn = new ButtonBuilder()
        .setCustomId('delete-btn')
        .setLabel('Delete')
        .setStyle(ButtonStyle.Danger)
      const toggleBtn = new ButtonBuilder()
        .setCustomId('toggle-btn')
        .setLabel('Toggle')
        .setStyle(ButtonStyle.Primary)
      const actionRow = new ActionRowBuilder()
        .addComponents(toggleBtn, deleteBtn);

      const dbNotif = await Notification.findOne({ where: { id: selection } })
      await i.update({
        content: `${ dbNotif.active ? '✅' : '🔳'} Twitch: ${dbNotif.twitchUrl}`,
        components: [actionRow],
        ephemeral: true
      })
      

      // ==================================== Delete/Toggle Btn Collection ====================================
      const confirmation = await res.awaitMessageComponent({ time: 60_000 });
      let successMsg = `### Successfully ${confirmation.customId === 'delete-btn' ? 'Deleted' : 'Toggled'} ` + 
        `Twitch Live Notification for: [${dbNotif.twitchUsername}](${dbNotif.twitchUrl}) `

      // Update DB
      if (confirmation.customId === 'delete-btn') {
        await dbNotif.destroy();
      } else if (confirmation.customId === 'toggle-btn') {        
        await dbNotif.update({ active: !dbNotif.active });
      }

      await confirmation.update({ content: successMsg, components: [], ephemeral: true });
    });
  } catch (error) {
    console.error(error)
    interaction.editReply(error.botMessage ? error.botMessage : "Unexpected error occured.")
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
      await addNotification(interaction)
      break;
    case 'view':
      await modifyNotification(interaction)
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