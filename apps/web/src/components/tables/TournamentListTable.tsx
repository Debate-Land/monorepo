/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Tournament, TournamentResult, Round, Circuit, Alias, School, TournamentSpeakerResult } from '@shared/database'
import { Text, asTable, Card } from '@shared/components'
import RoundByRoundTable from './RoundByRoundTable'

type ExpandedTournamentResult = TournamentResult & {
  tournament: Tournament & {
      circuits: Circuit[];
  };
  alias: Alias;
  school: School;
  speaking: TournamentSpeakerResult[];
}

export interface TournamentListTableProps {
  data: ExpandedTournamentResult[] // | ((page: number, limit: number) => TournamentResult)
}

const TournamentListTable = ({ data }: TournamentListTableProps) => {
  const { Table, Attribute } = asTable<ExpandedTournamentResult>()

  return (
    <Card icon={<BsJournalBookmark />} title="Tournament History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        expand={(d) => <RoundByRoundTable tournamentResultId={d.id} />}
        className={{ wrapper: 'max-w-[800px]' }}
      >
        <Attribute
          header="Tourn"
          value={{
            literal: (d) => d.tournament.name,
          }}
          description="Tournament name"
        />
        <Attribute
          header="Date"
          sortable
          value={{
            literal: (d) => d.tournament.start,
            display: (d) => {
              return (
                <Text size="sm">
                  {new Date(d.tournament.start * 1000).toLocaleDateString('en-us')}
                </Text>
              )
            },
          }}
        />
        <Attribute
          header="P.Rk"
          value={{
            literal: (d) => d.prelimPos,
            display: (d) => (
              <Text size="sm">
                {d.prelimPos}/{d.prelimPoolSize}
              </Text>
            ),
          }}
          description="Prelim. Rank"
          priority="sm"
        />
        <Attribute
          header="P.Rc"
          value={{
            literal: (d) => d.prelimBallotsWon,
            display: (d) => (
              <Text size="sm">
                {d.prelimBallotsWon}-{d.prelimBallotsLost}
              </Text>
            ),
          }}
          description="Prelim. Win-Loss Record"
        />
        <Attribute
          header="P.Wp"
          value={{
            literal: (d) => d.prelimBallotsWon / (d.prelimBallotsWon + d.prelimBallotsLost),
            percentage: true,
          }}
          description="Prelim. Win Percentage"
          priority="md"
        />
        <Attribute
          header="E.Rc"
          value={{
            literal: (d) => d.elimWins || 0,
            display: (d) => (
              <Text size="sm">
                {d.tournament.hasElimRounds ? `${d.elimWins}-${d.elimLosses}` : '--'}
              </Text>
            ),
          }}
          description="Elim. Win-Loss Record"
          priority="md"
        />
        <Attribute
          header="Bid"
          value={{
            literal: (d) => d.bid ? (d.bid == 1 ? 'Full' : 'Partial') : 'None',
          }}
          description="Bid"
        />
      </Table>
    </Card>
  )
}

export default TournamentListTable
