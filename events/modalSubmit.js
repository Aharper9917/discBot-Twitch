const { Events, Collection } = require('discord.js');

const execute = async (interaction) => {
	if (!interaction.isModalSubmit()) return; 
  // console.log(interaction)

  try {
    const modal = require(`@modals/${interaction.customId}`);
    
    await modal.onSubmit(interaction)
  }
  catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while submitting your form!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while submitting your form!', ephemeral: true });
    }
  }
}

module.exports = {
	name: Events.InteractionCreate,
	execute
};
