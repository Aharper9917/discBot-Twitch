const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const getCommands = () => {
  const commands = [];
  const foldersPath = path.join(__dirname, '../commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const command = require(filePath);
      if (command.disabled) break;

      if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
      } else {
        console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
  return commands;
};

const deployCommands = async () => {
  const commands = getCommands();
  const rest = new REST().setToken(process.env.DISCORD_TOKEN);

  try {
    if (process.env.DISCORD_GUILDID !== undefined) {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      const data = await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_GUILDID),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } else {
      console.log(`Started refreshing ${commands.length} global application (/) commands.`);
      const data = await rest.put(
        Routes.applicationCommands(process.env.DISCORD_CLIENTID),
        { body: commands }
      );
      console.log(`Successfully reloaded ${data.length} global application (/) commands.`);
    }
  } catch (error) {
    console.error('Failed to deploy commands:', error);
  }
};

module.exports = { deployCommands };

// Run directly if executed as script
if (require.main === module) {
  require('module-alias/register');
  require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env` });
  deployCommands();
}
