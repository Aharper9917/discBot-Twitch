const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('notifications')
  .setDescription(`Modify what Twitch users you'll get live notifications for.`)

const execute = async (interaction) => {
  const modal = require('@modals/twitch-notifications');
  await modal.show(interaction);
}

module.exports = {
  cooldown: 1,
	data,
  execute
};