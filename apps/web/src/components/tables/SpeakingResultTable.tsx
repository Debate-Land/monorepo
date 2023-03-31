import React from 'react'
import { Round, RoundSpeakerResult } from '@shared/database'
import { Text, asTable } from '@shared/components'

export interface SpeakingResultProps {
    data: RoundSpeakerResult[] //| ((page: number, limit: number) => TournamentResult)
}

const SpeakingResultTable = ({ data: speakingResults }: SpeakingResultProps) => {
    const { Table, Attribute } = asTable<RoundSpeakerResult>()

    return (
        <Table data={speakingResults}>
            <Attribute
                header="Comp"
                value={{
                    literal: (d) => d.competitorId,
                    display: (dChild) => <Text size="sm">{dChild.competitorId}</Text>
                }}
            />
            <Attribute
                header="Pts"
                value={{
                    literal: (dChild) => dChild.points,
                    display: (dChild) => <Text size="sm">{dChild.points}</Text>
                }}
            />
        </Table>
    )
}

export default SpeakingResultTable