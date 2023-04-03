import React from 'react'
import { Alias, Competitor, Judge, Round, RoundSpeakerResult, Side } from '@shared/database'
import { Table } from '@shared/components'
import { trpc } from '@src/utils/trpc'
import RoundTable from './RoundTable'
import { ExpandedTournamentResult } from './TournamentHistoryTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import TournamentSpeakingResultTable from './TournamentSpeakingResultTable'
import TournamentRoundsTable from './TournamentRoundsTable'

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

export interface TournamentSummaryTableProps {
  row: ExpandedTournamentResult;
};

// TODO: Move this to its own thing... not really a table
const TournamentSummaryTable = ({ row: parent }: TournamentSummaryTableProps) => {
  return (
    <div className="space-y-2">
      <TournamentRoundsTable id={parent.id} />
      <TournamentSpeakingResultTable data={parent.speaking} />
    </div>
  )
}

export default TournamentSummaryTable
