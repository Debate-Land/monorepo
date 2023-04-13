import React, { useState } from 'react'
import { Alias, Competitor, Judge, Round, RoundSpeakerResult, Side } from '@shared/database'
import { Table, Text } from '@shared/components'
import { trpc } from '@src/utils/trpc'
import RoundTable from './RoundTable'
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

export interface TournamentRoundsTableProps {
  id: number;
};

const TournamentRoundsTable = ({ id }: TournamentRoundsTableProps) => {
  const { data } = trpc.team.rounds.useQuery(
    {
      id
    },
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const column = createColumnHelper<ExpandedRound>();

  return (
    <div>
      <Text className="text-xl font-bold dark:text-gray-300 text-gray-700 mb-1">Rounds</Text>
      <Table
        data={data}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.accessor('nameStd', {
              header: "Round",
              cell: props => props.cell.getValue()
            }),
            column.accessor('opponent', {
              header: "Opponent",
              cell: props => props.row.original.opponent?.aliases[0].code || '--',
              enableSorting: false
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
        sortable
      />
    </div>
  )
}

export default TournamentRoundsTable
