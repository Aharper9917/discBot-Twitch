class BotError extends Error {
  constructor(message) {
    super(message);
    this.name = "BotError";
    this.botMessage = message ? "# 🟥 " + message + " 🟥" : "🟥 Unexpected error occured. 🟥"
  }
}

module.exports = BotError