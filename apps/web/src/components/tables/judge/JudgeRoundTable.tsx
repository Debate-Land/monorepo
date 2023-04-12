/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Table, Card } from '@shared/components'
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table'
import { JudgeRecord, Round, RoundSpeakerResult } from '@shared/database';

type ExpandedRound = Round & {
  speaking: (RoundSpeakerResult & {
    competitor: {
      name: string;
    }
  })[];
};

type ExpandedJudgeRecord = JudgeRecord & {
  teams: {
    id: string;
    aliases: {
      code: string;
    }[];
  }[];
  rounds: ExpandedRound[];
  tournament: {
    name: string;
    start: number;
  };
};

export interface JudgeRoundTableProps {
  data: ExpandedJudgeRecord;
}

// Team, W/L + Side, Speaks

const JudgeRoundTable = ({ data }: JudgeRoundTableProps) => {
  const column = createColumnHelper<ExpandedRound>();

  return (
    <Card icon={<BsJournalBookmark />} title="Judging History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data.rounds}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.display({
              header: "Team",
              cell: props => props.row.original.teams[0].aliases[0].code,
              enableSorting: false,
            }),
            column.accessor('tournament.start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
          ] as ColumnDef<ExpandedRound>[],
          lg: [
            column.accessor('decision', {
              header: "Dec.",
              cell: props => props.cell.getValue()
            }),
            column.accessor('avgSpeakerPoints', {
              header: "Avg. Speaks",
              cell: props => props.cell.getValue()
            }),
          ] as ColumnDef<ExpandedRound>[],
        }}
        sortable
      />
    </Card>
  )
}

export default JudgeRoundTable
