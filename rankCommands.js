const { calculateRank, getNextRank } = require('./ranks');

async function handleRankCommands(bot, message, user, userData) {
  if (message.toLowerCase() === '!rank') {
    const currentRank = calculateRank(userData.wallet);
    const nextRank = getNextRank(userData.wallet);
    
    let response = `${currentRank.color} Your current rank: ${currentRank.name}\n`;
    response += `💰 Current balance: ${userData.wallet} chips\n`;
    response += `🎲 Max bet: ${currentRank.benefits.maxBet} chips\n`;
    response += `🎁 Daily bonus: ${currentRank.benefits.dailyBonus} chips\n`;
    
    if (nextRank) {
      response += `\n📈 Next rank: ${nextRank.name}\n`;
      response += `🎯 Chips needed: ${nextRank.chipsNeeded}`;
    } else {
      response += "\n👑 Congratulations! You've reached the highest rank!";
    }
    
    bot.whisper.send(user.id, response);
    return true;
  }

  if (message.toLowerCase() === '!ranks') {
    let response = "🎰 Casino Ranks & Benefits 🎰\n\n";
    Object.entries(ranks).forEach(([key, rank]) => {
      response += `${rank.color} ${rank.name}\n`;
      response += `💰 Required chips: ${rank.minChips}+\n`;
      response += `🎲 Max bet: ${rank.benefits.maxBet}\n`;
      response += `🎁 Daily bonus: ${rank.benefits.dailyBonus}\n\n`;
    });
    
    bot.whisper.send(user.id, response);
    return true;
  }

  return false;
}

async function claimDailyBonus(bot, user, userData) {
  const now = Date.now();
  const lastClaim = userData.lastDailyClaim || 0;
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (now - lastClaim < oneDayMs) {
    const timeLeft = oneDayMs - (now - lastClaim);
    const hoursLeft = Math.floor(timeLeft / (60 * 60 * 1000));
    const minutesLeft = Math.floor((timeLeft % (60 * 60 * 1000)) / (60 * 1000));
    
    bot.whisper.send(user.id, 
      `⏳ Please wait ${hoursLeft}h ${minutesLeft}m before claiming your next daily bonus.`
    );
    return false;
  }

  const rank = calculateRank(userData.wallet);
  userData.wallet += rank.benefits.dailyBonus;
  userData.lastDailyClaim = now;
  
  bot.whisper.send(user.id, 
    `🎁 Daily bonus claimed! +${rank.benefits.dailyBonus} chips\n` +
    `💰 New balance: ${userData.wallet} chips`
  );
  
  return userData;
}

module.exports = {
  handleRankCommands,
  claimDailyBonus
};