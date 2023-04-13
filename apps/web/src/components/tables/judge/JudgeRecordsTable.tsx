import React from 'react'
import { Table } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ExpandedJudgeTournamentResult } from './JudgingHistoryTable';
import { JudgeRecord, Round, RoundSpeakerResult, Competitor, Team } from '@shared/database';
import { trpc } from '@src/utils/trpc';
import JudgeRecordTable from './JudgeRecordTable';
import JudgeSpeakingTable from './JudgeSpeakingTable';

export type ExpandedJudgeRecord = JudgeRecord & {
  rounds: (Round & {
    speaking: (RoundSpeakerResult & {
      competitor: Competitor;
    })[];
    result: {
      team: (Team & {
        aliases: {
          code: string;
        }[];
      });
    };
  })[];
};

export interface JudgeRecordsTableProps {
  data: ExpandedJudgeTournamentResult;
}

const JudgeRecordsTable = ({ data: { id } }: JudgeRecordsTableProps) => {
  const { data } = trpc.judge.records.useQuery(
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
  const column = createColumnHelper<ExpandedJudgeRecord>();

  return (
    <Table
      data={data && data as ExpandedJudgeRecord[]}
      numLoadingRows={5}
      columnConfig={{
        core: [
          column.display({
            header: "Round",
            cell: props => props.row.original.rounds[0].nameStd
          }),
          column.accessor('decision', {
            header: "Dec.",
            cell: props => props.cell.getValue()
          }),
        ] as ColumnDef<ExpandedJudgeRecord>[],
        lg: [
          column.accessor('wasSquirrel', {
            header: "Squirrel",
            cell: props => props.cell.getValue() !== undefined
              ? props.cell.getValue()
                ? 'Yes'
                : 'No'
              : '--'
          }),
          column.accessor('avgSpeakerPoints', {
            header: "Avg. Speaks",
            cell: props => props.cell.getValue() || '--'
          }),
        ] as ColumnDef<ExpandedJudgeRecord>[],
      }}
      child={({ row: parent }) => (
        <div className="space-y-2">
          <JudgeRecordTable data={parent} />
          <JudgeSpeakingTable data={parent} />
        </div>
      )}
      sortable
    />
  )
}

export default JudgeRecordsTable;
