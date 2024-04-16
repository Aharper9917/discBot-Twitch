const crypto = require('crypto')

// Notification request headers
const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

const getSecret = () => {
  return process.env.TWITCH_CLIENTID;
}

// Build the message used to get the HMAC.
const getHmacMessage = (request) => {
  return (request.headers[TWITCH_MESSAGE_ID] + 
      request.headers[TWITCH_MESSAGE_TIMESTAMP] + 
      request.body);
}

// Get the HMAC.
const getHmac = (secret, message) => {
  return crypto.createHmac('sha256', secret)
  .update(message)
  .digest('hex');
}

// Verify whether our hash matches the hash that Twitch passed in the header.
const verifyMessage = (hmac, verifySignature) => {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}

module.exports = {
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
}