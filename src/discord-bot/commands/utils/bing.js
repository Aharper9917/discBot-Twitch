const { SlashCommandBuilder } = require('discord.js');

const data = new SlashCommandBuilder()
  .setName('bing')
  .setDescription('Replies with Pong!');

const execute = async (interaction) => {
  await interaction.deferReply({ephemeral: true})

  await interaction.editReply('Bong!');
  setTimeout(() => {
    interaction.editReply('[Bong!](https://tenor.com/view/bing-bong-fuck-yo-life-gif-23922204)');
  }, 1500);
}

module.exports = {
  cooldown: 5,
	data,
	execute,
};