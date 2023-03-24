import SpeakingResult from '../types/speaking-result'
import React from 'react'
import { asTable } from './general/Table'
import Text from './general/Text'

export interface SpeakingResultProps {
  data: SpeakingResult[] //| ((page: number, limit: number) => TournamentResult)
}

const SpeakingResultTable = ({ data: speakingResults }: SpeakingResultProps) => {
  const { Table, Attribute } = asTable<SpeakingResult>()

  return (
    <Table data={speakingResults}>
      <Attribute
        header="Comp"
        value={{
          literal: (dChild) => dChild._id,
          display: (dChild) => <Text size="sm">{dChild._id}</Text>
        }}
      />
      <Attribute
        header="Raw"
        value={{
          literal: (dChild) => dChild.raw_avg,
          display: (dChild) => <Text size="sm">{dChild.raw_avg}</Text>
        }}
      />
      <Attribute
        header="Adj"
        value={{
          literal: (dChild) => dChild.adj_avg,
          display: (dChild) => <Text size="sm">{dChild.adj_avg}</Text>
        }}
      />
    </Table>
  )
}

export default SpeakingResultTable