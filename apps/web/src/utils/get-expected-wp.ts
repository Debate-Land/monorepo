export default function getExpectedWP(otr1: number, otr2: number, avgJudgeIndex: number = 10) {
  const deltaOtr = Math.abs(otr1 - otr2);
  const avgOtr = (otr1 + otr2) / 2;
  const initDelta = ((1.47 * Math.pow(deltaOtr, 0.8094)) * (1 / (4 * avgOtr))); //+ 0.5;
  const adjDelta = initDelta / (1 + Math.pow(2, -(avgJudgeIndex - 3)));

  return adjDelta + 0.5;
}