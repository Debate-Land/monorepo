import React from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ExpandedTournamentSpeakerResult } from './TournamentHistoryTable'

export interface TournamentSpeakingResultProps {
  data: ExpandedTournamentSpeakerResult[]
}

const TournamentSpeakingResultTable = ({ data }: TournamentSpeakingResultProps) => {
  const column = createColumnHelper<ExpandedTournamentSpeakerResult>()

  return (
    <div>
      <Text className="text-xl font-bold dark:text-gray-300 text-gray-700 mb-1">Speaking</Text>
      {
        data.length
          ? (
            <Table
              data={data}
              columnConfig={{
                core: [
                  column.accessor('competitor.name', {
                    header: "Comp.",
                    cell: props => props.cell.getValue()
                  }),
                  column.accessor('rawAvgPoints', {
                    header: "Raw Avg.",
                    cell: props => props.cell.getValue().toFixed(1)
                  }),
                  column.accessor('adjAvgPoints', {
                    header: "Adj. Avg.",
                    cell: props => props.cell.getValue().toFixed(1)
                  }),
                ] as ColumnDef<ExpandedTournamentSpeakerResult>[]
              }}
            />
          )
          : (
            <div className="w-full flex justify-center dark:text-gray-300 text-gray-700">
              <Text>
                No speaking results!
              </Text>
            </div>
          )
      }
    </div>
  )
}

export default TournamentSpeakingResultTable
