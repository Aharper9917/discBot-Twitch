require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env` })
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
	try {
    let data = {}
    if (process.env.DISCORD_GUILDID !== undefined) {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      data = await rest.put(
        Routes.applicationGuildCommands(process.env.DISCORD_CLIENTID, process.env.DISCORD_GUILDID),
        { body: commands },
      );
      console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    }
    // else {
    //   data = await rest.put(Routes.applicationCommand(process.env.DISCORD_CLIENTID), { body: commands });
    // }
    
	}
  catch (error) {
		console.error(error);
	}
})();
