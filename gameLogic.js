const { calculateRank } = require('./ranks');

const HOUSE_EDGE = 0.05; // 5% house edge
const BLACKJACK_PAYOUT = 1.5; // 3:2 payout for blackjack
const WINNING_PAYOUT = 0.95; // 95% payout on regular wins (implements house edge)

function drawCard(userCards, dealerCards, isDealer = false) {
  const suits = ["♥", "♦", "♣", "♠"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  
  // House edge implementation
  if (isDealer) {
    // Dealer has slightly better odds of drawing 10-value cards
    const dealerValues = ["10", "J", "Q", "K", "A", "10", "J", "Q", "K", "9", "8", "7", "6"];
    const value = dealerValues[Math.floor(Math.random() * dealerValues.length)];
    const suit = suits[Math.floor(Math.random() * suits.length)];
    return value + suit;
  }

  // Regular card draw for players
  const value = values[Math.floor(Math.random() * values.length)];
  const suit = suits[Math.floor(Math.random() * suits.length)];
  return value + suit;
}

function calculatePoints(cards) {
  let points = 0;
  let aces = 0;

  for (let card of cards) {
    const value = card.slice(0, -1);
    
    if (value === "A") {
      points += 11;
      aces += 1;
    } else if (["K", "Q", "J"].includes(value)) {
      points += 10;
    } else {
      points += parseInt(value);
    }
  }

  // Adjust for aces
  while (points > 21 && aces > 0) {
    points -= 10;
    aces -= 1;
  }

  return points;
}

function calculatePayout(bet, userCards, dealerCards) {
  const userPoints = calculatePoints(userCards);
  const dealerPoints = calculatePoints(dealerCards);

  // Player busts
  if (userPoints > 21) {
    return 0;
  }

  // Player has blackjack (21 with exactly 2 cards)
  if (userPoints === 21 && userCards.length === 2) {
    return bet * BLACKJACK_PAYOUT;
  }

  // Dealer busts or player wins
  if (dealerPoints > 21 || userPoints > dealerPoints) {
    return bet * (1 + WINNING_PAYOUT);
  }

  // Push (tie)
  if (userPoints === dealerPoints) {
    return bet;
  }

  // Player loses
  return 0;
}

function shouldDealerHit(dealerCards) {
  const points = calculatePoints(dealerCards);
  
  // Dealer must hit on soft 17 (increases house edge slightly)
  if (points === 17 && dealerCards.includes("A")) {
    return true;
  }
  
  return points < 17;
}

// Progressive rewards system
function calculateProgressiveBonus(userData) {
  const rank = calculateRank(userData.wallet);
  const gamesPlayed = userData.gamesPlayed || 0;
  const bonusMultiplier = Math.min(1.2, 1 + (gamesPlayed * 0.001)); // Max 20% bonus

  return {
    winMultiplier: bonusMultiplier,
    rankBonus: rank.benefits.maxBet * 0.01 // 1% of max bet as bonus
  };
}

module.exports = {
  drawCard,
  calculatePoints,
  calculatePayout,
  shouldDealerHit,
  calculateProgressiveBonus,
  HOUSE_EDGE,
  BLACKJACK_PAYOUT,
  WINNING_PAYOUT
};