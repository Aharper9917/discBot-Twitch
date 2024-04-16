// curl -X POST 'https://api.twitch.tv/helix/eventsub/subscriptions' \
// -H 'Authorization: Bearer 2gbdx6oar67tqtcmt49t3wpcgycthx' \
// -H 'Client-Id: wbmytr93xzw8zbg0p1izqyzzc5mbiz' \
// -H 'Content-Type: application/json' \
// -d '{"type":"channel.follow","version":"2","condition":{"broadcaster_user_id":"1234", "moderator_user_id": "1234"},"transport":{"method":"webhook","callback":"https://example.com/callback","secret":"s3cre77890ab"}}' 

class TwitchAPI {
  clientId;
  clientSecret;
  token;

  constructor(clientId, clientSecret) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async setToken() {
    if (this.token && Date.now() < this.token.expires) return
    const res = await fetch("https://id.twitch.tv/oauth2/token?" + new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials'
    }), { method: "POST" });

    if (res.status !== 200) {
      throw new Error(`Coudn't fetch API Token`)
    }
    const data = await res.json()
    this.token = {
      ...data,
      expires: Date.now() + (data.expires_in * 1000)
    }
  }
  
  subscribe(broadcaster_user_id) {
    fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
      method: "POST",
      body: JSON.stringify({
        "type": "stream.online",
        "version": "2",
        "condition": {
          "broadcaster_user_id": broadcaster_user_id,
        },
        "transport": {
          "method": "webhook",
          "callback": "https://example.com/callback",
          "secret": "s3cre77890ab"
        }
      }),
      headers: {
        "Content-type": "application/json",
        "Client-Id": process.env.TWITCH_CLIENTID
      }
    });
  }
  
  getBroadcasterId(username) {
    // fetch("https://api.twitch.tv/helix/users", {
    //   method: "GET"
    // })
    fetch('https://api.twitch.tv/helix/users?' + new URLSearchParams({
      login: username,
    }), {
      method: "GET",
      body: JSON.stringify({

      })
    })
  }
}

module.exports = { TwitchAPI }