# TwitchBot
Discord Bot to allow your server to follow certain Twitch channels and get notified when they go live

## Setup
Populate\
`.env`

Install\
`Node v20`

Install Dependancies\
`npm install`

## Run
You can run the project locally with\
`npm run start`

Update changes to slash commands:\
`npm run deply-commands`


## Deploy
Build Docker Image\
`docker build -t discord-twitch-bot .`

Run Docker Conatiner:\
`docker run -d discord-twitch-bot -e DISCORD_TOKEN=<your_token> DISCORD_CLIENTID=<your_clientid> DISCORD_GUILDID=<your_guildid>`

List containers:\
`docker ps`


## TODO
- [ ] Add Verification
  - [ ] Channel
  - [ ] Twitch URL
- [ ] Persistant Storage
- [ ] Integrate twitch api
