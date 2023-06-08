export default function getExpectedWP(otr1: number, otr2: number) {
  const deltaOtr = Math.abs(otr1 - otr2);
  const avgOtr = (otr1 + otr2) / 2;
  return ((1.47 * Math.pow(deltaOtr, 0.8094)) * (1 / (4 * avgOtr))) + 0.5;
}