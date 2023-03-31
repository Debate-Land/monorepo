import React from 'react'
import { Alias, Judge, Round, RoundSpeakerResult, Side } from '@shared/database'
import { Text, asTable } from '@shared/components'
import SpeakingResultTable from './SpeakingResultTable'
import { trpc } from '@src/utils/trpc'

type ExpandedRound = Round & {
  judgeRecords: {
      judge: Judge;
      decision: Side;
      tabJudgeId: number;
  }[];
  speaking: RoundSpeakerResult[];
  opponent: {
      id: string;
      aliases: Alias[];
  } | null;
}

export interface RoundByRoundTableProps {
  tournamentResultId: number //| ((page: number, limit: number) => TournamentResult)
}

const RoundByRoundTable = ({ tournamentResultId: id }: RoundByRoundTableProps) => {
  const { Table, Attribute } = asTable<ExpandedRound>();
  const {data: rounds} = trpc.rounds.useQuery({id})

  if (!rounds) return <></>;

  return (
    <Table data={(rounds)}>
      <Attribute
        header="Rnd"
        value={{ literal: (d) => d.nameStd }}
        description='Standardized round name'
      />
      <Attribute
        header="Opp"
        value={{ literal: (d) => d.opponent?.aliases[0].code as string }}
        description='Opponent'
      />
      <Attribute
        header="Res"
        value={{ literal: (d) => d.result }}
        description='Round result'
      />
      {/* <Attribute
        header="Dec"
        value={{
          literal: (d) => d.decision[0],
          display: (d) => <Text size="sm">{d.decision[0]}-{d.decision[1]}</Text>
        }}
        description='Decision'
        priority='sm'
      /> */}
      <Attribute
        header="Side"
        value={{ literal: (d) => d.side }}
        description='Side in round'
      />
      {/* <Attribute
        header="OpWP"
        value={{ literal: (d) => d.opWpm, percentage: true }}
        description='Opponent win percentage'
      /> */}
      <Attribute
        header="Jud"
        value={{ literal: (d) => d.judgeRecords[0]?.decision || '--' }}
      />
      <Attribute
        header="Spks"
        value={{
          literal: (d) => 1,
          display: (d) => <SpeakingResultTable data={d.speaking} />
        }}
        description='Speaker point results'
        priority="md"
      />
    </Table>
  )
}

export default RoundByRoundTable