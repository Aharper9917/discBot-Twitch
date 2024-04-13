FROM node:20

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN touch .env
RUN npm install

COPY . /usr/src/bot
RUN npm run db:sync:force
# RUN npm run db:sync
# RUN node syncdb.js

# Start the bot.
CMD ["node", "index.js"]