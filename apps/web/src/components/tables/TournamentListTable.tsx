/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Tournament, TournamentResult, Round } from '@shared/database'
import { Text, asTable, Card } from '@shared/components'
import RoundByRoundTable from './RoundByRoundTable'

export interface TournamentListTableProps {
  data: TournamentResult[] // | ((page: number, limit: number) => TournamentResult)
}

const TournamentListTable = ({ data }: TournamentListTableProps) => {
  const { Table, Attribute } = asTable<TournamentResult>()

  return (
    <Card icon={<BsJournalBookmark />} title="Tournament History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        expand={(d) => <RoundByRoundTable data={d.prelim_rounds.concat(d.elim_rounds) as Round[]} />}
        className={{ wrapper: 'max-w-[800px]' }}
      >
        <Attribute
          header="Tourn"
          value={{
            literal: (d) => (d.tournament as Tournament).name,
          }}
          description="Tournament name"
        />
        <Attribute
          header="Dur"
          value={{
            literal: (d) => (d.tournament as Tournament).start_date,
            display: (d) => {
              const tourn = d.tournament as Tournament
              return (
                <Text size="sm">
                  {new Date(tourn.start_date).toLocaleDateString('en-us')}-
                  {new Date(tourn.end_date).toLocaleDateString('en-us')}
                </Text>
              )
            },
          }}
        />
        <Attribute
          header="P.Rk"
          value={{
            literal: (d) => d.prelim_rank[0],
            display: (d) => (
              <Text size="sm">
                {d.prelim_rank[0]}/{d.prelim_rank[1]}
              </Text>
            ),
          }}
          description="Prelim. Rank"
          priority="sm"
        />
        <Attribute
          header="P.Rc"
          value={{
            literal: (d) => d.prelim_record[0],
            display: (d) => (
              <Text size="sm">
                {d.prelim_record[0]}-{d.prelim_record[1]}
              </Text>
            ),
          }}
          description="Prelim. Win-Loss Record"
        />
        <Attribute
          header="P.Wp"
          value={{
            literal: (d) => d.prelim_record[0] / (d.prelim_record[0] + d.prelim_record[1]),
            percentage: true,
          }}
          description="Prelim. Win Percentage"
          priority="md"
        />
        <Attribute
          header="E.Rc"
          value={{
            literal: (d) => d.elim_record[0],
            display: (d) => (
              <Text size="sm">
                {d.elim_record[0]}-{d.elim_record[1]}
              </Text>
            ),
          }}
          description="Elim. Win-Loss Record"
          priority="md"
        />
        <Attribute
          header="E.In"
          value={{
            literal: (d) => (d.elim_rounds.length ? (d.elim_rounds[0] as Round).name_std : 'Prelims'),
          }}
          description="Eliminated In"
        />
        <Attribute
          header="Bid"
          value={{
            literal: (d) => d.bid || 'None',
          }}
          description="Bid"
        />
      </Table>
    </Card>
  )
}

export default TournamentListTable
