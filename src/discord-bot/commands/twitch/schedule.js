const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { isValidTwitchUrl, getTwitchUsernameFromUrl } = require('@discord-bot/utils/url');
const { BotError } = require('@errors/BotError');
const { TwitchAPI } = require('@twitch-api');
const Notification = require('@db/models/notification');

const twitch = new TwitchAPI();

const data = new SlashCommandBuilder()
  .setName('schedule')
  .setDescription(`Display a Twitch streamer's upcoming stream schedule`)
  .addStringOption(option =>
    option
      .setName('streamer')
      .setDescription('Twitch username or URL')
      .setRequired(true)
      .setAutocomplete(true)
  );

const autocomplete = async (interaction) => {
  const focusedValue = interaction.options.getFocused().toLowerCase();
  const notifications = await Notification.findAll({ where: { guildId: interaction.guild.id } });

  const choices = notifications
    .map(n => ({ name: n.twitchUsername, value: n.twitchUsername }))
    .filter(c => c.name.toLowerCase().includes(focusedValue))
    .slice(0, 25);

  await interaction.respond(choices);
};

const execute = async (interaction) => {
  try {
    await interaction.deferReply();

    let input = interaction.options.getString('streamer').trim();

    // Strip @ prefix if present (common user mistake)
    if (input.startsWith('@')) {
      input = input.slice(1);
    }

    // Parse username from URL if provided
    let username;
    if (isValidTwitchUrl(input)) {
      username = getTwitchUsernameFromUrl(input);
    } else {
      username = input;
    }

    // Get user info
    const userInfo = await twitch.getUserInfo(username);
    if (!userInfo) {
      throw new BotError('Twitch user not found');
    }

    // Get schedule
    const schedule = await twitch.getSchedule(userInfo.id);

    // Build embed
    const embed = new EmbedBuilder()
      .setColor(0x9146FF) // Twitch purple
      .setAuthor({
        name: `${userInfo.display_name}'s Schedule`,
        iconURL: userInfo.profile_image_url,
        url: `https://twitch.tv/${userInfo.login}`
      })
      .setThumbnail(userInfo.profile_image_url);

    // Check if streamer has no schedule configured
    if (!schedule.hasSchedule) {
      embed.setDescription('This streamer has not set up a schedule.');
      await interaction.editReply({ embeds: [embed] });
      return;
    }

    // Check for vacation mode
    if (schedule.vacation) {
      const endDate = Math.floor(new Date(schedule.vacation.end_time).getTime() / 1000);
      embed.addFields({
        name: '🏖️ On Vacation',
        value: `Returns <t:${endDate}:R> (<t:${endDate}:D>)`
      });
    }

    // Add scheduled streams
    if (schedule.segments && schedule.segments.length > 0) {
      const streamList = schedule.segments.map(segment => {
        const startTime = Math.floor(new Date(segment.start_time).getTime() / 1000);
        const category = segment.category?.name || 'No category';
        const title = segment.title || 'Untitled stream';
        const recurring = segment.is_recurring ? ' 🔁' : '';

        return `<t:${startTime}:F>\n**${title}**\n${category}${recurring}`;
      }).join('\n\n');

      embed.setDescription(streamList);
    } else {
      embed.setDescription('No upcoming streams scheduled.');
    }

    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.log(error);
    const message = error.botMessage || 'Unexpected error occurred.';
    if (interaction.deferred) {
      await interaction.editReply(message);
    } else {
      await interaction.reply({ content: message, ephemeral: true });
    }
  }
};

module.exports = {
  cooldown: 5,
  data,
  execute,
  autocomplete
};
