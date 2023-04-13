import React from 'react'
import { Table, Text } from '@shared/components'
import { ExpandedRound, ExpandedRoundJudgeRecord } from './TournamentHistoryTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import RoundSpeakingResultTable from './RoundSpeakingResultTable'

export interface RoundTableProps {
  row: ExpandedRound
}

const RoundTable = ({ row: { records: judgeRecords, speaking, ...round } }: RoundTableProps) => {
  const column = createColumnHelper<ExpandedRoundJudgeRecord>();

  return judgeRecords.length
    ? (
      <Table
        data={judgeRecords}
        columnConfig={{
          core: [
            column.accessor('judge', {
              header: "Judge",
              cell: props => props.cell.getValue().name,
              enableSorting: false
            }),
            column.accessor('decision', {
              header: "Dec.",
              cell: props => `${props.cell.getValue()} (${props.cell.getValue() === round.side ? 'W' : 'L'})`
            }),
          ] as ColumnDef<ExpandedRoundJudgeRecord>[],
          lg: [
            column.display({
              header: "Spk.",
              cell: (props) => {
                let speakingResults = speaking.filter(
                  result => result.judgeId === props.row.original.judge.id
                );
                return speakingResults.length
                  ? <RoundSpeakingResultTable data={speakingResults} />
                  : <>--</>
              }
            }),
          ] as ColumnDef<ExpandedRoundJudgeRecord>[],
        }}
        sortable
      />
    )
    : (
      <div className="w-full flex justify-center p-3">
        <Text>
          No judging details for {round.nameStd}!
        </Text>
      </div>
    )
}

export default RoundTable
