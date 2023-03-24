import Round from '../types/round'
import React from 'react'
import { asTable } from './general/Table'
import Text from './general/Text'
import SpeakingResultTable from './SpeakingResultTable'

export interface RoundByRoundTableProps {
  data: Round[] //| ((page: number, limit: number) => TournamentResult)
}

const RoundByRoundTable = ({ data: rounds }: RoundByRoundTableProps) => {
  const { Table, Attribute } = asTable<Round>()

  return (
    <Table data={rounds}>
      <Attribute
        header="Rnd"
        value={{ literal: (d) => d.name_std }}
        description='Standardized round name'
      />
      <Attribute
        header="Opp"
        value={{ literal: (d) => d.opponent as string }}
        description='Standardized round name'
      />
      <Attribute
        header="Res"
        value={{ literal: (d) => d.result }}
        description='Round result'
      />
      <Attribute
        header="Dec"
        value={{
          literal: (d) => d.decision[0],
          display: (d) => <Text size="sm">{d.decision[0]}-{d.decision[1]}</Text>
        }}
        description='Decision'
        priority='sm'
      />
      <Attribute
        header="Side"
        value={{ literal: (d) => d.side }}
        description='Side in round'
      />
      <Attribute
        header="OpWP"
        value={{ literal: (d) => d.op_wp, percentage: true }}
        description='Opponent win percentage'
      />
      <Attribute
        header="Jud"
        value={{ literal: (d) => d.judges[0] as string }}
      />
      <Attribute
        header="Spks"
        value={{
          literal: (d) => 1,
          display: (dParent) => <SpeakingResultTable data={dParent.speaking_results} />
        }}
        description='Speaker point results'
        priority="md"
      />
    </Table>
  )
}

export default RoundByRoundTable