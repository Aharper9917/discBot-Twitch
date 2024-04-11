const { TextInputStyle } = require('discord.js');
const modalBuilder = require('@utils/modalBuilder.js')

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
    console.log({ url, userId });
  
    await interaction.reply({ content: 'Your submission was received successfully!', ephemeral: true });
  }
}
