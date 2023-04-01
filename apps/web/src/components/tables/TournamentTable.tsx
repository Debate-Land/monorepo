import React from 'react'
import { Card, asTable } from '@shared/components'
import { School, Tournament } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'

type TournamentTableRow = Tournament & {
  _count: {
      results: number;
  };
  results: {
      school: School;
  }[];
}

export interface SchoolTableProps {
  data: TournamentTableRow[]
}

const TournamentTable = ({ data }: SchoolTableProps) => {
  const { Table, Attribute } = asTable<TournamentTableRow>();

  return (
    <Card icon={<TbListDetails />} title="Tournaments" className="max-w-[800px] mx-auto my-16">
      <Table data={(data)}>
        <Attribute
          header="Name"
          value={{
            literal: (d) => d.name,
          }}
          description='Tournament Name'
        />
        <Attribute
          header="Date"
          value={{
            literal: (d) => d.start,
            display: (d) => <>{new Date(d.start * 1000).toLocaleDateString('en-us')}</>
          }}
          description='Tournament Start Date'
          sortable
        />
        <Attribute
          header="Entries"
          value={{
            literal: (d) => d._count.results,
          }}
          description='Tournament Entries'
        />
        <Attribute
          header="Elims"
          value={{
            literal: (d) => d.hasElimRounds ? 'Yes' : 'No'
          }}
        />
      </Table>
    </Card>
    )
}

export default TournamentTable
