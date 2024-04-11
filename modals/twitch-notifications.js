const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const modal = {
  id: 'twitch-notifications',
}

const showModal = async (interaction) => {
  const Modal = new ModalBuilder()
  .setCustomId('twitch-notifications')
  .setTitle('Twitch Live Notifications');
  
  const favoriteColorInput = new TextInputBuilder()
  .setCustomId('favoriteColorInput')
  .setLabel("What's your favorite color?")
  .setStyle(TextInputStyle.Short);
  
  const hobbiesInput = new TextInputBuilder()
  .setCustomId('hobbiesInput')
  .setLabel("What's some of your favorite hobbies?")
  .setStyle(TextInputStyle.Paragraph);
  
  const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
  const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);
  
  Modal.addComponents(firstActionRow, secondActionRow);
  
  await interaction.showModal(Modal);
}

const submitModal = async (interaction) => {
  if (interaction.customId !== modal.id) return;
  
  const favoriteColor = interaction.fields.getTextInputValue('favoriteColorInput');
  const hobbies = interaction.fields.getTextInputValue('hobbiesInput');
  console.log({ favoriteColor, hobbies });

  await interaction.reply({ content: 'Your submission was received successfully!' });
}

module.exports = {
  ...modal,
  onShow: showModal,
  onSubmit: submitModal
};