const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const build = async(interaction, modal) => {
  const Modal = new ModalBuilder()
    .setCustomId(modal.id)
    .setTitle('Twitch Live Notifications');

  const rows = []

  for (const input of modal.inputs) {
    console.log(input)
    const textInput = new TextInputBuilder()
      .setCustomId(input.id)
      .setLabel(input.label)
      .setStyle(input.style)
    rows.push(new ActionRowBuilder().addComponents(textInput))
  }

  Modal.addComponents(...rows);
  
  await interaction.showModal(Modal);
}

module.exports = {
  build
}