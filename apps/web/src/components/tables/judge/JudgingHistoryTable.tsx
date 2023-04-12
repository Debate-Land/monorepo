/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Table, Card } from '@shared/components'
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table'
import { JudgeRecord, RoundSpeakerResult } from '@shared/database';
import { JudgeTable } from '../dataset';
import JudgeRoundTable from './JudgeRoundTable';

type JudgeRound = JudgeRecord & {
  teams: {
    id: string;
    aliases: {
      code: string;
    }[];
  }[];
  rounds: {
    speaking: (RoundSpeakerResult & {
      competitor: {
        name: string;
      }
    })[];
    nameStd: string;
  }[];
  tournament: {
    name: string;
    start: number;
  };
};

export interface JudgingHistoryTableProps {
  data?: JudgeRound[];
}

const JudgingHistoryTable = ({ data }: JudgingHistoryTableProps) => {
  const column = createColumnHelper<JudgeRound>();

  return (
    <Card icon={<BsJournalBookmark />} title="Judging History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.display({
              header: "Round",
              cell: props => `${props.row.original.tournament.name} (${props.row.original.rounds[0].nameStd})`,
              enableSorting: false,
            }),
            column.accessor('tournament.start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
          ] as ColumnDef<JudgeRound>[],
          lg: [
            column.accessor('decision', {
              header: "Dec.",
              cell: props => props.cell.getValue()
            }),
            column.accessor('avgSpeakerPoints', {
              header: "Avg. Speaks",
              cell: props => props.cell.getValue()
            }),
          ] as ColumnDef<JudgeRound>[],
        }}
        child={({ row: parent }) => (
          <JudgeRoundTable data={parent} />
        )}
        sortable
      />
    </Card>
  )
}

export default JudgingHistoryTable
