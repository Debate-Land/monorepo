/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Table, Card } from '@shared/components'
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table'
import { JudgeRecord, JudgeTournamentResult, RoundSpeakerResult } from '@shared/database';
import JudgeRecordsTable from './JudgeRecordsTable';

export type ExpandedJudgeTournamentResult = JudgeTournamentResult & {
  tournament: {
    name: string;
    start: number;
  } | null
};

export interface JudgingHistoryTableProps {
  data?: ExpandedJudgeTournamentResult[];
}

const JudgingHistoryTable = ({ data }: JudgingHistoryTableProps) => {
  const column = createColumnHelper<ExpandedJudgeTournamentResult>();

  return (
    <Card icon={<BsJournalBookmark />} title="Judging History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.accessor('tournament.name', {
              header: "Name",
              cell: props => props.cell.getValue()
            }),
            column.accessor('tournament.start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
            column.accessor('numPrelims', {
              header: "Rounds",
              cell: props => props.row.original.numPrelims + (props.row.original.numElims || 0)
            }),
          ] as ColumnDef<ExpandedJudgeTournamentResult>[],
          lg: [
            column.accessor('avgRawPoints', {
              header: "Avg. Speaks",
              cell: props => Math.round((props.cell.getValue() || 0) * 100) / 100 || '--'
            }),
            column.accessor('stdDevPoints', {
              header: "σ Speaks",
              cell: props => Math.round((props.cell.getValue() || 0) * 100) / 100 || '--'
            }),
          ] as ColumnDef<ExpandedJudgeTournamentResult>[],
        }}
        child={({ row: parent }) => (
          <JudgeRecordsTable data={parent} />
        )}
        sortable
      />
    </Card>
  )
}

export default JudgingHistoryTable
