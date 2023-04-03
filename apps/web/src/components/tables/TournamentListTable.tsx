/* eslint-disable react/no-unstable-nested-components */
import React from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Tournament, TournamentResult, Round, Circuit, Alias, School, TournamentSpeakerResult } from '@shared/database'
import { Table, Card } from '@shared/components'
// import RoundByRoundTable from './RoundByRoundTable'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'

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
  const column = createColumnHelper<ExpandedTournamentResult>();
  console.log(data)

  return (
    <Card icon={<BsJournalBookmark />} title="Tournament History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columns={
          [
            column.accessor('tournament.name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('tournament.start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
            column.display({
              header: "P. Rk.",
              cell: props => `${props.row.original.prelimPos}/${props.row.original.prelimPoolSize}`
            }),
            column.display({
              header: "P. Rc.",
              cell: props => {
                const won = props.row.original.prelimBallotsWon;
                const lost = props.row.original.prelimBallotsLost;
                return `${won}-${lost} (${Math.trunc(won/(won+lost))}%)`
              }
            }),
            column.display({
              header: "E. Rc.",
              cell: props => {
                const won = props.row.original.elimWins || 0;
                const lost = props.row.original.elimLosses || 0;
                if (won + lost == 0) return '--';
                return `${won}-${lost} (${Math.trunc(won / (won + lost))}%)`;
              }
            }),
            column.display({
              header: "Bid",
              cell: props => {
                let bid = props.row.original.bid;
                let isGhostBid = props.row.original.isGhostBid;
                if (!bid) return '--';
                return `${bid == 1 ? 'Full' : 'Partial'} ${isGhostBid ? '(ghost)' : ''}`;
              }
            }),
          ] as ColumnDef<ExpandedTournamentResult>[]
        }
      />
    </Card>
  )
}

export default TournamentListTable
