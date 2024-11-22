const { Highrise, GatewayIntentBits } = require("highrise.sdk");
const { ranks, calculateRank, getNextRank } = require('./utils/ranks');
const { handleGameLogic } = require('./utils/gameLogic');
const config = require('./config');

// In-memory database
const users = new Map();

const bot = new Highrise({
  intents: [
    GatewayIntentBits.Ready,
    GatewayIntentBits.Joins,
    GatewayIntentBits.Leaves,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Messages,
    GatewayIntentBits.Error,
    GatewayIntentBits.Reactions,
    GatewayIntentBits.Movements,
    GatewayIntentBits.Tips
  ],
  AutoFetchMessages: true,
  cache: true
});

let botID;
let usersList = [];
let userNamesList = [];

// Initialize or get user data
function getUser(userId, username) {
  if (!users.has(userId)) {
    users.set(userId, {
      userId,
      username,
      wallet: 0,
      gamesPlayed: 0,
      lastDailyClaim: 0,
      status: 'idle'
    });
  }
  return users.get(userId);
}

bot.on("ready", async (session) => {
  botID = session.user_id;
  console.log(`Bot connected to ${session.room_info.room_name}`);
  
  const results = await bot.room.players.fetch();
  usersList = results.map(player => player[0].id).filter(id => id !== botID);
  userNamesList = results.map(player => player[0].username);
});

bot.on("chatCreate", async (user, message) => {
  try {
    const userData = getUser(user.id, user.username);
    
    if (message.toLowerCase() === '!rank') {
      const currentRank = calculateRank(userData.wallet);
      const nextRank = getNextRank(userData.wallet);
      
      let response = `${currentRank.color} Your rank: ${currentRank.name}\n`;
      response += `💰 Balance: ${userData.wallet} chips\n`;
      
      if (nextRank) {
        response += `\n📈 Next rank: ${nextRank.name} (${nextRank.chipsNeeded} more chips)`;
      }
      
      bot.whisper.send(user.id, response);
      return;
    }

    if (message.toLowerCase() === '!daily') {
      const now = Date.now();
      const lastClaim = userData.lastDailyClaim || 0;
      const oneDayMs = 24 * 60 * 60 * 1000;

      if (now - lastClaim < oneDayMs) {
        const timeLeft = oneDayMs - (now - lastClaim);
        const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
        const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
        
        bot.whisper.send(user.id, `⏳ Wait ${hoursLeft}h ${minutesLeft}m for next bonus`);
        return;
      }

      const rank = calculateRank(userData.wallet);
      userData.wallet += rank.benefits.dailyBonus;
      userData.lastDailyClaim = now;
      
      bot.whisper.send(user.id, 
        `🎁 Daily bonus: +${rank.benefits.dailyBonus} chips\n` +
        `💰 Balance: ${userData.wallet} chips`
      );
      return;
    }

    // Handle game commands
    await handleGameLogic(bot, message, user, userData);

  } catch (error) {
    console.error('Error handling chat command:', error);
    bot.whisper.send(user.id, "An error occurred. Please try again.");
  }
});

bot.on("playerTip", async (sender, receiver, item) => {
  if (receiver.id === botID && item.amount >= 1) {
    const userData = getUser(sender.id, sender.username);
    const chips = item.amount;
    
    userData.wallet += chips;
    
    bot.whisper.send(sender.id, 
      `💰 ${chips} chips added!\n` +
      `Balance: ${userData.wallet} chips\n` +
      `Use !bet [amount] to play!`
    );
  }
});

bot.on("error", (error) => {
  console.error("Bot error:", error);
  setTimeout(() => {
    bot.login(config.bot.token, config.bot.room);
  }, 5000);
});

// Start the bot
bot.login(config.bot.token, config.bot.room);