
class TwitchAPI {
  clientId;
  clientSecret;
  authHeader;
  token;
  /* this.token {
    access_token: 'TOKEN',
    expires_in: 4883199, // seconds
    token_type: 'bearer',
    expires: 1718131840984 // unix timestamp
  }*/

  constructor(clientId = process.env.TWITCH_CLIENTID, clientSecret = process.env.TWITCH_CLIENTSECRET) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  async setToken() {
    try {
      if (Date.now() < this.token?.expires) return
      console.log(`Fetching Token...`)
  
      const res = await fetch("https://id.twitch.tv/oauth2/token?" + new URLSearchParams({
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: 'client_credentials'
      }), { method: "POST" });
  
      if (res.status !== 200) throw new Error(`Coudn't fetch API Token`)
  
      const data = await res.json()
      this.authHeader = 'Bearer ' + data.access_token
      this.token = {
        ...data,
        expires: Date.now() + (data.expires_in * 1000)
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  async subscribe(username) {
    await this.setToken();
    try {
      const broadcasterId = await this.getBroadcasterId(username)
      const currentSubs = (await this.listSubscriptions()).filter((sub) => sub.condition.broadcaster_user_id === broadcasterId)
      if (currentSubs.length > 0) {
        console.log(`Subscription for ${username} already exists`)
        return
      }

      console.log(`Adding Subscription for ${username}`)
      const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': this.authHeader,
          'Client-Id': this.clientId,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          'type': 'stream.online',
          'version': '1',
          'condition': {
            'broadcaster_user_id': broadcasterId
          },
          'transport': {
            'method': 'webhook',
            'callback': 'https://this-is-a-callback.com',
            'secret': process.env.TWITCH_SESSION_SECRET
          }
        })
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        console.log('Error', await res.json())
        throw new Error(message);
      }
      
      const data = (await res.json()).data;
      return data;
    } catch (error) {
      console.log(error)
    }
  }

  async unsubscribe(username) {
    await this.setToken();
    try {
      const subs = await this.listSubscriptions()

      for (const sub of subs) {
        if (sub.condition.broadcaster_user_id === await this.getBroadcasterId(username)) {
          await this.deleteSubscription(sub.id)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  async deleteSubscription(id) {
    await this.setToken();
    try {
      const res = await fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.authHeader,
          'Client-Id': this.clientId,
        }
      });

      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        console.log('Error', await res.json())
        throw new Error(message);
      }
    } catch (error) {
      console.log(error)
    }
  }

  async listSubscriptions() {
    await this.setToken();
    try {
      const res = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        headers: {
          'Authorization': this.authHeader,
          'Client-Id': this.clientId,
        }
      });
  
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        console.log('Error', await res.json())
        throw new Error(message);
      }
      const subs = (await res.json()).data;
      // console.log('listSubscriptions:', subs)
      return subs;
    } catch (error) {
      console.log(error)
    }
  }
  
  async getBroadcasterId(username) {
    await this.setToken();
    try {      
      const res = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
        headers: {
          'Authorization': this.authHeader,
          'Client-Id': this.clientId,
        }
      });
  
      if (!res.ok) {
        const message = `An error has occured: ${res.status}`;
        console.log('Error', await res.json())
        throw new Error(message);
      }
      const broadcasterId = (await res.json()).data[0].id;
      return broadcasterId;
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = { TwitchAPI }