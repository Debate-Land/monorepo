import React from 'react'
import { TbListDetails } from 'react-icons/tb'
import { TournamentResult, Tournament, Circuit } from '@shared/database'
import { Card, asTable } from '@shared/components'

type ExpandedTournamentResult = TournamentResult & {
  tournament: Tournament & {
      circuits: Circuit[];
  };
}

export interface CareerSummaryTableProps {
  data: ExpandedTournamentResult[] // | ((page: number, limit: number) => TournamentResult)
}

interface TournamentBySeason {
  season: number
  tournaments: TournamentResult[]
}

const CareerSummaryTable = ({ data: results }: CareerSummaryTableProps) => {
  const [seasons, setSeasons] = React.useState<TournamentBySeason[]>([])
  const { Table, Attribute } = asTable<TournamentBySeason>()

  React.useEffect(() => {
    const newSeasons: TournamentBySeason[] = []
    results.forEach((result) => {
      const tourn = result.tournament
      const season = tourn.seasonId
      const seasonIndex = newSeasons.findIndex((s) => s.season === season)
      if (seasonIndex === -1) {
        newSeasons.push({ season, tournaments: [result] })
      } else {
        newSeasons[seasonIndex].tournaments.push(result)
      }
    })
    setSeasons(newSeasons)
  }, [results])

  return (
    <Card icon={<TbListDetails />} title="Career Summary" className="max-w-[800px] mx-auto my-16">
      <Table data={seasons} summary>
        <Attribute
          header="Szn"
          value={{
            literal: ({ season }) => season,
          }}
          sortable
        />
        <Attribute
          header="Tournaments"
          value={{
            literal: ({ tournaments }) => tournaments.length,
          }}
          summarizable
        />
      </Table>
    </Card>
  )
}

export default CareerSummaryTable
