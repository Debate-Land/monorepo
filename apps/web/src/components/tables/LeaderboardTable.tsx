import React from 'react'
import { Card, asTable } from '@shared/components'
import { Alias } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'
import { useRouter } from 'next/router';

type LeaderboardRow = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
}

export interface RoundTableProps {
  data: LeaderboardRow[]
}

const LeaderboardTable = ({ data }: RoundTableProps) => {
  const router = useRouter();
  const { Table, Attribute } = asTable<LeaderboardRow>();

  return (
    <Card icon={<TbListDetails />} title="Leaderboard" className="max-w-[800px] mx-auto my-16">
      <Table
        data={(data)}
        onClick={(d) => {
          router.push(`/${router.query.event as string}/teams/${d.team.id}`)
        }}
      >
        <Attribute
          header="OTR"
          value={{
            literal: (d) => d.otr,
            display: (d) => <>{Math.round(d.otr * 1000) / 1000}</>
          }}
          description='OTR Score'
          sortable
        />
        <Attribute
          header="Team"
          value={{ literal: (d) => d.team.aliases[0].code }}
          description='Team Code'
        />
      </Table>
    </Card>
    )
}

export default LeaderboardTable
