// ==================================== Dependencies ====================================
require('dotenv').config({ path: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : `.env` })
require('module-alias/register')
require('@db/database')
require('@db/relations')

// ==================================== Twitch API ====================================
const { TwitchAPI } = require('@twitch-api')
const initTwitchApi = async () => {
  const twitchApi = new TwitchAPI(process.env.TWITCH_CLIENTID, process.env.TWITCH_CLIENTSECRET)
  return twitchApi
}

// ==================================== Discord Bot ====================================
const { DiscordBot } = require('@discord-bot')
const discordBot = new DiscordBot()

// ==================================== EVENT SUB ====================================
const {
  TWITCH_MESSAGE_ID,
  TWITCH_MESSAGE_TIMESTAMP,
  TWITCH_MESSAGE_SIGNATURE,
  MESSAGE_TYPE,
  MESSAGE_TYPE_VERIFICATION,
  MESSAGE_TYPE_NOTIFICATION,
  MESSAGE_TYPE_REVOCATION,
  HMAC_PREFIX,
  getSecret,
  getHmacMessage,
  getHmac,
  verifyMessage,
} = require('@twitch-api/eventsub')
const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
})

app.use(express.raw({
  type: 'application/json'
}))

app.get('/', (req, res) => {
  res.status(200).send('OK');
})

// EventSub handler function
const handleEventSub = (req, res) => {
  // console.log('EventSub Request Recieved:', req)
  try {
    let secret = getSecret();
    let message = getHmacMessage(req);
    let hmac = HMAC_PREFIX + getHmac(secret, message);  // Signature to compare

    if (true === verifyMessage(hmac, req.headers[TWITCH_MESSAGE_SIGNATURE])) {
      console.log("EventSub - Signatures Match");
      let notification = JSON.parse(req.body);

      if (MESSAGE_TYPE_NOTIFICATION === req.headers[MESSAGE_TYPE]) {
        console.log(`EventSub - EventType: ${notification.subscription.type}`);
        console.log('EventSub - ' + JSON.stringify(notification.event, null, 4));

        discordBot.client.liveEvent = notification.event
        if (notification.subscription.type === 'stream.online') {
          discordBot.client?.emit('twitch-live-online', discordBot.client);
        }
        else if (notification.subscription.type === 'stream.offline') {
          discordBot.client?.emit('twitch-live-offline', discordBot.client);
        }

        res.sendStatus(204);
      }
      else if (MESSAGE_TYPE_VERIFICATION === req.headers[MESSAGE_TYPE]) {
        console.log(`EventSub - MESSAGE_TYPE_VERIFICATION`)
        res.set('Content-Type', 'text/plain').status(200).send(notification.challenge);
      }
      else if (MESSAGE_TYPE_REVOCATION === req.headers[MESSAGE_TYPE]) {
        res.sendStatus(204);

        console.log(`EventSub - ${notification.subscription.type} notifications revoked!`);
        console.log(`EventSub - Reason: ${notification.subscription.status}`);
        console.log(`EventSub - Condition: ${JSON.stringify(notification.subscription.condition, null, 4)}`);
      }
      else {
        res.sendStatus(204);
        console.log(`EventSub - Unknown Message Type: ${req.headers[MESSAGE_TYPE]}`);
      }
    }
    else { // Signatures didn't match.
      console.log('EventSub - 403');
      res.sendStatus(403);
    }
  } catch (error) {
    console.log(`EventSub - `, error)
  }
}

// Handle both /eventsub and /discbot-twitch/eventsub paths
app.post('/eventsub', handleEventSub)
app.post('/discbot-twitch/eventsub', handleEventSub)


