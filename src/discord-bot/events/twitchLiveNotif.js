const execute = async (client) => {
  console.log(`DISCORD RECIEVED NOTIF ALERT`, client.liveEvent);
}

module.exports = {
	name: 'twitch-live-notification',
	once: false,
	execute
};
