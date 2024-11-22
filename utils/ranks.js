const ranks = {
  NOVICE: {
    name: "Novice",
    minChips: 0,
    maxChips: 999,
    color: "⚪",
    benefits: {
      maxBet: 100,
      dailyBonus: 10,
      houseEdge: 0.05
    }
  },
  AMATEUR: {
    name: "Amateur",
    minChips: 1000,
    maxChips: 4999,
    color: "🟢",
    benefits: {
      maxBet: 500,
      dailyBonus: 50,
      houseEdge: 0.045
    }
  },
  EXPERT: {
    name: "Expert",
    minChips: 5000,
    maxChips: 49999,
    color: "🟣",
    benefits: {
      maxBet: 2000,
      dailyBonus: 200,
      houseEdge: 0.04
    }
  },
  LEGEND: {
    name: "Legend",
    minChips: 50000,
    maxChips: Infinity,
    color: "⭐",
    benefits: {
      maxBet: 10000,
      dailyBonus: 1000,
      houseEdge: 0.035
    }
  }
};

function calculateRank(chips) {
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (chips >= rankData.minChips && chips <= rankData.maxChips) {
      return { ...rankData, key: rankKey };
    }
  }
  return ranks.NOVICE;
}

function getNextRank(currentChips) {
  for (const [rankKey, rankData] of Object.entries(ranks)) {
    if (rankData.minChips > currentChips) {
      return {
        ...rankData,
        chipsNeeded: rankData.minChips - currentChips,
        key: rankKey
      };
    }
  }
  return null;
}

module.exports = {
  ranks,
  calculateRank,
  getNextRank
};