export default function getExpectedWP(otr1: number, otr2: number, avgJudgeIndex?: number) {
  const deltaOtr = Math.abs(otr1 - otr2);
  const avgOtr = (otr1 + otr2) / 2;

  let index = avgJudgeIndex !== undefined && !Number.isNaN(avgJudgeIndex) ? avgJudgeIndex : 10;

  return ((1.47 * Math.pow(deltaOtr, 0.8094)) * (1 / (4 * avgOtr))) / (1 + Math.pow(2, -(index - 3))) + 0.5;
}