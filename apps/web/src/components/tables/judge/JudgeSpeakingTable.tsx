import React from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table'
import { ExpandedJudgeRecord } from './JudgeRecordsTable';

export interface JudgeSpeakingTableProps {
  data: ExpandedJudgeRecord;
}

const JudgeSpeakingTable = ({ data: rawData }: JudgeSpeakingTableProps) => {
  const column = createColumnHelper<ExpandedJudgeRecord['rounds'][0]['speaking'][0]>();

  const data: ExpandedJudgeRecord['rounds'][0]['speaking'][0][] = [];

  rawData.rounds.forEach(r => {
     r.speaking.map(s => data.push(s))
  })

  return (
    <div>
      <Text className="text-xl font-bold dark:text-gray-300 text-gray-700 mb-1">Speaking</Text>
      {
        data.length
          ? (
            <Table
            data={data}
            numLoadingRows={5}
            columnConfig={{
              core: [
                column.display({
                  header: "Competitor",
                  cell: props => props.row.original.competitor.name
                }),
                column.accessor('points', {
                  header: "Points",
                  cell: props => props.cell.getValue()
                }),
              ] as ColumnDef<ExpandedJudgeRecord['rounds'][0]['speaking'][0]>[],
            }}
            sortable
          />
        )
        : (
          <div className="w-full flex justify-center dark:text-gray-300 text-gray-700 pb-3">
            <Text>
              No speaking results!
            </Text>
          </div>
        )
      }
    </div>

  )
}

export default JudgeSpeakingTable;
