import React from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ExpandedTournamentSpeakerResult } from './TournamentListTable'

export interface TournamentSpeakingResultProps {
    data: ExpandedTournamentSpeakerResult[]
}

const TournamentSpeakingResultTable = ({ data }: TournamentSpeakingResultProps) => {
  const column = createColumnHelper<ExpandedTournamentSpeakerResult>()

  return data.length
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
      <div className="w-full flex justify-center p-3">
        <Text>
            No speaking result details!
        </Text>
      </div>
  )
}

export default TournamentSpeakingResultTable
