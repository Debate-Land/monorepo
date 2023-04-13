import { ElimRoundName } from "@shared/database";

type RecordLike<T> = T & {
  rounds: {
    nameStd: string;
  }[];
}

export default function sortRounds<T>(records: RecordLike<T>[]) {
  let prelims: RecordLike<T>[] = [];
  let elims: RecordLike<T>[] = [];

  records.forEach(record => {
    record.rounds[0].nameStd.includes('Round')
      ? prelims.push(record)
      : elims.push(record)
  });

  prelims.sort((a, b) => {
    const numA = parseInt(a.rounds[0].nameStd.split(' ')[1]);
    const numB = parseInt(b.rounds[0].nameStd.split(' ')[1]);

    return numA - numB;
  });

  elims.sort((a, b) => {
    const idxA = Object.keys(ElimRoundName).indexOf(a.rounds[0].nameStd);
    const idxB = Object.keys(ElimRoundName).indexOf(b.rounds[0].nameStd);

    return idxB - idxA
  });

  return [...prelims, ...elims]
}