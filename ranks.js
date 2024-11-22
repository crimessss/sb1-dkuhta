const ranks = {
  NOVICE: {
    name: "Novice",
    minChips: 0,
    maxChips: 999,
    color: "⚪",
    benefits: {
      maxBet: 100,
      dailyBonus: 10
    }
  },
  AMATEUR: {
    name: "Amateur",
    minChips: 1000,
    maxChips: 4999,
    color: "🟢",
    benefits: {
      maxBet: 500,
      dailyBonus: 50
    }
  },
  INTERMEDIATE: {
    name: "Intermediate",
    minChips: 5000,
    maxChips: 9999,
    color: "🔵",
    benefits: {
      maxBet: 1000,
      dailyBonus: 100
    }
  },
  EXPERT: {
    name: "Expert",
    minChips: 10000,
    maxChips: 49999,
    color: "🟣",
    benefits: {
      maxBet: 2000,
      dailyBonus: 200
    }
  },
  MASTER: {
    name: "Master",
    minChips: 50000,
    maxChips: 99999,
    color: "🔴",
    benefits: {
      maxBet: 5000,
      dailyBonus: 500
    }
  },
  LEGEND: {
    name: "Legend",
    minChips: 100000,
    maxChips: Infinity,
    color: "⭐",
    benefits: {
      maxBet: 10000,
      dailyBonus: 1000
    }
  }
};

function calculateRank(chips) {
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (chips >= rankData.minChips && chips <= rankData.maxChips) {
      return {
        ...rankData,
        key: rankKey
      };
    }
  }
  return ranks.NOVICE;
}

function getNextRank(currentChips) {
  const currentRank = calculateRank(currentChips);
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (rankData.minChips > currentChips) {
      return {
        ...rankData,
        chipsNeeded: rankData.minChips - currentChips,
        key: rankKey
      };
    }
  }
  return null; // Already at highest rank
}

module.exports = {
  ranks,
  calculateRank,
  getNextRank
};