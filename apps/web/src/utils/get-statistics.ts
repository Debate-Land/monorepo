import { Team, Circuit, Season, Competitor, TournamentResult, CircuitRanking, Tournament, TournamentSpeakerResult } from "@shared/database";
import getRelativeTime from "@src/utils/get-relative-time";

type ExpandedTeam = Team & {
  _count: {
      rounds: number;
  };
  circuits: Circuit[];
  seasons: Season[];
  competitors: Competitor[];
  results: (TournamentResult & {
    tournament: Tournament;
    speaking: TournamentSpeakerResult[];
  })[];
  rankings: CircuitRanking[];
}

interface TeamStatistics {
  lastActive: string;
  tWp: number;
  pWp: number;
  eWp: number;
  pRecord: [number, number];
  eRecord: [number, number];
  avgOpWpM: number;
  breakPct: number;
  madeElims: number;
  otr: number;
  avgSpeaks: number;
  rankings: any;
  bids: number;
  inTop20Pct: number;
}

export function getAvg(arr: number[]) {
  if (!arr.length) return 0;
  let sum = 0;
  arr.forEach(e => sum += e);
  return sum / arr.length;
}

function getDeflator(tourns: number) {
  let N = 1;
  let Y0 = 0.15;
  let K = 1.3;

  return Math.round(
    N / ((N / Y0 - 1) * Math.pow(Math.E, -K * tourns) + 1) * 100
  ) / 100;
}

export default function getStatistics(data: ExpandedTeam) {
  let statistics: any = {
    lastActive: '', //
    tWp: 0, //
    pWp: 0, //
    eWp: 0, //
    pRecord: [0, 0], //
    eRecord: [0, 0], //
    avgOpWpM: [], //
    breakPct: [0, 0], //
    madeElims: 0, //
    otr: [], //
    avgSpeaks: [], //
    rankings: [],
    bids: 0,
    inTop20Pct: 0,
  };

  data.results.forEach(result => {
    statistics.pRecord[0] += result.prelimBallotsWon;
    statistics.pRecord[1] += result.prelimBallotsLost;
    statistics.eRecord[0] += result.elimBallotsWon || 0;
    statistics.eRecord[1] += result.elimBallotsLost || 0;

    if (result.prelimPos / result.prelimPoolSize <= .2) statistics.inTop20Pct += 1;

    if (result.tournament.hasElimRounds) {
      // If they made elims one of these has to be truthy
      if (result.elimWins || result.elimLosses) {
        statistics.breakPct[0] += 1;
      }
      else {
        statistics.breakPct[1] += 1;
      }
    }

    statistics.otr.push(result.otrComp);
    statistics.avgOpWpM.push(result.opWpm);
    result.speaking.forEach(speakingResult => {
      statistics.avgSpeaks.push(speakingResult.rawAvgPoints);
    });

    if (result.bid) statistics.bids += result.bid;
  });

  data.results.sort((a, b) => a.tournament.start - b.tournament.start).reverse();
  statistics.lastActive = getRelativeTime(data.results[0].tournament.start * 1000);

  let numPrelims = statistics.pRecord[0] + statistics.pRecord[1];
  let numElims = statistics.eRecord[0] + statistics.eRecord[1];

  statistics.pWp = statistics.pRecord[0] / numPrelims;
  statistics.eWp = statistics.eRecord[0] / numElims;

  statistics.tWp = (statistics.pRecord[0] + statistics.eRecord[0]) / (numPrelims + numElims) + statistics.eWp * 0.1;
  if (statistics.tWp > 1) statistics.tWp = 1;

  statistics.madeElims = statistics.breakPct[0];
  statistics.breakPct = statistics.breakPct[0] / (statistics.breakPct[0] + statistics.breakPct[1]);

  statistics.otr = getDeflator(data.results.length) * getAvg(statistics.otr);
  statistics.avgOpWpM = getAvg(statistics.avgOpWpM);
  statistics.avgSpeaks = getAvg(statistics.avgSpeaks);

  return statistics as TeamStatistics;
}