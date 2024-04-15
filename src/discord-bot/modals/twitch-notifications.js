const { TextInputStyle } = require('discord.js');
const modalBuilder = require('./modalBuilder.js')

const data = {
  id: 'twitch-notifications',
  title: 'Twitch Live Notifications',
  inputs: [
    {
      id: 'twitch-url',
      label: 'Twitch URL:',
      style: TextInputStyle.Short
    },
    {
      id: 'discord-user-id',
      label: 'Discord User Id:',
      style: TextInputStyle.Short
    },
    {
      id: 'discord-channel-id',
      label: 'Discord Channel Id:',
      style: TextInputStyle.Short
    }
  ],
}

module.exports = {
  ...data,
  show: async (interaction) => {
    await modalBuilder.build(interaction, data)
  },
  submit: async (interaction) => {
    if (interaction.customId !== data.id) return;
  
    const url = interaction.fields.getTextInputValue('twitch-url');
    const userId = interaction.fields.getTextInputValue('discord-user-id');
    const channelId = interaction.fields.getTextInputValue('discord-channel-id');
    console.log({ url, userId, channelId });
  
    await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
  }
}
