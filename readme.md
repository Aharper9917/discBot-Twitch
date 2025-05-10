# TwitchBot
Discord Bot to allow your server to follow certain Twitch channels and get notified when they go live.

## Local Setup
Populate\
`.env`

Install\
`Node v20`

Install Dependancies\
`npm install`

## Run Locally
You can run the project locally with\
`npm run start`

Update changes to slash commands:\
`npm run deply-commands`


## Deploy Locally
Build Docker Image\
`docker build -t discord-twitch-bot .`

Run Docker Conatiner:\
`docker run -d discord-twitch-bot -e DISCORD_TOKEN=<your_token> DISCORD_CLIENTID=<your_clientid> DISCORD_GUILDID=<your_guildid>`

List containers:\
`docker ps`

## Github Actions: CI/CD
This project uses Github Actions to build the Docker image. Then using a Github Runner the image get pushed to my homelab server.
[![Docker Runner](https://github.com/Aharper9917/discBot-Twitch/actions/workflows/runner.yml/badge.svg)](https://github.com/Aharper9917/discBot-Twitch/actions/workflows/runner.yml)