const { SlashCommandBuilder, ChannelType, PermissionFlagsBits } = require('discord.js');
const Guild = require('@db/models/guild');

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
  try {
    await interaction.deferReply({ephemeral: true})
  
    const [ dbGuild, dbCreated ] = await Guild.findOrCreate({ where: { id: interaction.guild.id } })
    await dbGuild.update({ notificationChannelId: interaction.options.getChannel('channel').id })
  
    await interaction.editReply(`### Twitch Live Notifications will now be posted in ${interaction.options.getChannel('channel')}`);
  } catch (error) {
    console.log(error)
    interaction.editReply(error.botMessage ? error.botMessage : "Unexpected error occured.")
  }
}

module.exports = {
  cooldown: 5,
	data,
	execute,
};