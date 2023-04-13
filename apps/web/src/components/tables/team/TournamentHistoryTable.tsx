/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Tournament, TeamTournamentResult, Circuit, Alias, School, TournamentSpeakerResult, Competitor, Judge, Round, RoundSpeakerResult, Side, Bid } from '@shared/database'
import { Table, Card } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import TournamentRoundsTable from './TournamentRoundsTable'
import TournamentSpeakingResultTable from './TournamentSpeakingResultTable'

export type ExpandedTournamentSpeakerResult = TournamentSpeakerResult & {
  competitor: {
    name: string
  }
};

export type ExpandedTournamentResult = TeamTournamentResult & {
  tournament: Tournament & {
    circuits: Circuit[];
  };
  alias: Alias;
  school: School;
  speaking: ExpandedTournamentSpeakerResult[];
  bid: Bid | any;
};

export type ExpandedRoundJudgeRecord = {
  judge: Judge;
  decision: Side;
};

export type ExpandedRoundSpeakerResult = RoundSpeakerResult & {
  competitor: Competitor;
}

export type ExpandedRound = Round & {
  records: ExpandedRoundJudgeRecord[];
  speaking: ExpandedRoundSpeakerResult[];
  opponent: {
    id: string;
    aliases: Alias[];
  } | null;
}

export interface TournamentHistoryTableProps {
  data?: ExpandedTournamentResult[]
}

const TournamentHistoryTable = ({ data }: TournamentHistoryTableProps) => {
  const column = createColumnHelper<ExpandedTournamentResult>();

  return (
    <Card icon={<BsJournalBookmark />} title="Tournament History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.accessor('tournament.name', {
              header: "Name",
              cell: props => props.cell.getValue(),
              enableSorting: false,
            }),
            column.accessor('tournament.start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() as number * 1000).toLocaleDateString("en-us")
            }),
            column.accessor('prelimPos', {
              header: "P.RK",
              cell: props => `${props.row.original.prelimPos}/${props.row.original.prelimPoolSize}`
            }),
          ] as ColumnDef<ExpandedTournamentResult>[],
          sm: [
            column.accessor('prelimBallotsWon', {
              header: "P.RC",
              cell: props => {
                const won = props.row.original.prelimBallotsWon;
                const lost = props.row.original.prelimBallotsLost;
                return `${won}-${lost}`
              }
            }),
            column.accessor('elimWins', {
              header: "E.RC",
              cell: props => {
                const won = props.row.original.elimWins || 0;
                const lost = props.row.original.elimLosses || 0;
                if (won + lost == 0) return '--';
                return `${won}-${lost}`;
              }
            }),
            column.accessor('bid', {
              header: "Bid",
              cell: props => {
                let bid = props.row.original.bid;
                if (!bid) return '--';
                return `${bid.value} ${bid.isGhostBid ? '(ghost)' : ''}`;
              }
            }),
          ] as ColumnDef<ExpandedTournamentResult>[],
          lg: [
            column.accessor('opWpM', {
              header: "OpWpM",
              cell: props => props.cell.getValue(),
            }),
          ] as ColumnDef<ExpandedTournamentResult>[],
        }}
        child={({ row: parent }) => (
          <div className="space-y-2">
            <TournamentRoundsTable id={parent.id} />
            <TournamentSpeakingResultTable data={parent.speaking} />
          </div>
        )}
        sortable
      />
    </Card>
  )
}

export default TournamentHistoryTable
