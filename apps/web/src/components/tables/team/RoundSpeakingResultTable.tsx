import React from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { ExpandedRoundSpeakerResult } from './TournamentHistoryTable'

export interface RoundSpeakingResultProps {
    data: ExpandedRoundSpeakerResult[]
}

const RoundSpeakingResultTable = ({ data }: RoundSpeakingResultProps) => {
    const column = createColumnHelper<ExpandedRoundSpeakerResult>()

    return (
        <Table
            data={data}
            columnConfig={{
                core: [
                    column.accessor('competitor.name', {
                        header: "Comp.",
                        cell: props => props.cell.getValue()
                    }),
                    column.accessor('points', {
                        header: "Points",
                        cell: props => props.cell.getValue()
                    })
                ] as ColumnDef<ExpandedRoundSpeakerResult>[]
            }}
        />
    )
}

export default RoundSpeakingResultTable