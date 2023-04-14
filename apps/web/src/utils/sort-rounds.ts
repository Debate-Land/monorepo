import { ElimRoundName } from "@shared/database";

type RoundLike<T> = T & {
  nameStd: string
}

export default function sortRounds<T>(rounds: RoundLike<T>[]) {
  let prelims: RoundLike<T>[] = [];
  let elims: RoundLike<T>[] = [];

  rounds.forEach(round => {
    round.nameStd.includes('Round')
      ? prelims.push(round)
      : elims.push(round)
  });

  prelims.sort((a, b) => {
    const numA = parseInt(a.nameStd.split(' ')[1]);
    const numB = parseInt(b.nameStd.split(' ')[1]);

    return numA - numB;
  });

  elims.sort((a, b) => {
    const idxA = Object.keys(ElimRoundName).indexOf(a.nameStd.replace(' ', ''));
    const idxB = Object.keys(ElimRoundName).indexOf(b.nameStd.replace(' ', ''));

    return idxB - idxA
  });

  return [...prelims, ...elims]
}