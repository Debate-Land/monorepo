import React from 'react'
import { Alias, Competitor, Judge, Round, RoundSpeakerResult, Side } from '@shared/database'
import { Table } from '@shared/components'
import { trpc } from '@src/utils/trpc'
import RoundTable from './RoundTable'
import { ExpandedTournamentResult } from './TournamentListTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

export type ExpandedRoundJudgeRecord = {
  judge: Judge;
  decision: Side;
  tabJudgeId: number;
};

export type ExpandedRoundSpeakerResult = RoundSpeakerResult & {
  competitor: Competitor;
}

export type ExpandedRound = Round & {
  judgeRecords: ExpandedRoundJudgeRecord[];
  speaking: ExpandedRoundSpeakerResult[];
  opponent: {
      id: string;
      aliases: Alias[];
  } | null;
}

export interface RoundByRoundTableProps {
  row: ExpandedTournamentResult
}

// TODO: Sorting
const RoundByRoundTable = ({ row: parent }: RoundByRoundTableProps) => {
  const { data } = trpc.rounds.useQuery(
    {
      id: parent.id
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const column = createColumnHelper<ExpandedRound>();

  if (!data) return <></>;

  return (
    <Table
      data={data}
      columnConfig={{
        core: [
          column.accessor('nameStd', {
            header: "Round",
            cell: props => props.cell.getValue()
          }),
          column.accessor('opponent', {
            header: "Opponent",
            cell: props => props.row.original.opponent?.aliases[0].code || '--'
          }),
          column.accessor('result', {
            header: "Res.",
            cell: props => props.cell.getValue()
          }),
        ] as ColumnDef<ExpandedRound>[],
        sm: [
          column.accessor('ballotsWon', {
            header: "Dec.",
            cell: props => `${props.row.original.ballotsWon}-${props.row.original.ballotsLost}`
          }),
          column.accessor('side', {
            header: "Side",
            cell: props => props.cell.getValue()
          }),
        ] as ColumnDef<ExpandedRound>[],
      }}
      child={RoundTable}
    />
  )
}

export default RoundByRoundTable