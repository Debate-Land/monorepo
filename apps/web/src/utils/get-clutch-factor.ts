export default function getClutchFactor(
  numFavWins: number,
  numFavLosses: number,
  numUdWins: number,
  numUdLosses: number
) {
  const numFavRounds = numFavWins + numFavLosses;
  const numUdRounds = numUdWins + numUdLosses;

  return ((numUdWins * numUdRounds * 7) - (numUdLosses * numUdRounds * 0.5) + (numFavWins * numFavRounds * 2) - (numFavLosses * numFavRounds * 6)) / ((numFavRounds + numUdRounds) * 4);
}

export function getClutchFactorFromRoundHistory(
  otr: number,
  rounds: any[]
) {
    let numFavWins = 0;
    let numFavLosses = 0;
    let numUdWins = 0;
    let numUdLosses = 0;

    rounds.map(r => {
      const oppOtr = r.opponent?.rankings[0].otr;
      if (!oppOtr) return '--';
      if (oppOtr > otr) {
        if (r.outcome === "Win") numUdWins += 1;
        else if (r.outcome === "Loss") numUdLosses += 1;
      } else if (oppOtr < otr) {
        if (r.outcome === "Win") numFavWins += 1;
        else if (r.outcome === "Loss") numFavLosses += 1;
      };
    });

    const clutchFactor = getClutchFactor(numFavWins, numFavLosses, numUdWins, numUdLosses);
    console.log(
      numFavWins, numFavLosses, numUdWins, numUdLosses
    )
    if (clutchFactor < 0) return 0;
    else if (clutchFactor > 10) return 10;
    return clutchFactor;
};
