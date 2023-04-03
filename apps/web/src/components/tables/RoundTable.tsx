import React from 'react'
import { Table, Text } from '@shared/components'
import { ExpandedRound, ExpandedRoundJudgeRecord, ExpandedRoundSpeakerResult } from './RoundByRoundTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import SpeakingResultTable from './SpeakingResultTable'

export interface RoundTableProps {
  row: ExpandedRound
}

const RoundTable = ({ row: { judgeRecords, speaking, ...round } }: RoundTableProps) => {
  const column = createColumnHelper<ExpandedRoundJudgeRecord>();

  return judgeRecords.length
    ? (
      <Table
        data={judgeRecords}
        columnConfig={{
          core: [
            column.accessor('judge', {
              header: "Judge",
              cell: props => props.cell.getValue().name
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
                  ? <SpeakingResultTable data={speakingResults} />
                  : <>--</>
              }
            }),
          ] as ColumnDef<ExpandedRoundJudgeRecord>[],
        }}
        onRowClick={(row) => alert(row.tabJudgeId)}
      />
      // <JudgeRecordTable data={(judgeRecords)}>
      //   <JudgeRecordAttribute
      //     header="Spk."
      //     value={{
      //       literal: () => 0,
      //       display: (d) => {
      //         let speakingResults: ExpandedRoundSpeakerResult[] = speaking
      //           .filter((result) => result.judgeId == d.judge.id);

      //         return speakingResults.length
      //           ? (
      //             <SpeakingResultTable data={speakingResults}>
      //               <SpeakingResultAttribute
      //                 header="Comp."
      //                 value={{ literal: (d) => d.competitor.name }}
      //                 description="Competitor Name"
      //               />
      //               <SpeakingResultAttribute
      //                 header="Pts."
      //                 value={{ literal: (d) => d.points }}
      //                 description="Speaker Points"
      //               />
      //             </SpeakingResultTable>
      //             )
      //           : <Text>--</Text>
      //       }
      //     }}
      //     description='Round Speaking Data'
      //   />
      // </JudgeRecordTable>
    )
    : (
      <div className="w-full flex justify-center">
        <Text>
          No judging details for {round.nameStd}!
        </Text>
      </div>
    )
}

export default RoundTable
