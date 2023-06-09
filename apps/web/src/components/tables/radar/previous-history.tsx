import { Card, Table } from '@shared/components';
import { RoundOutcome, TeamRanking } from '@shared/database';
import { ColumnDef, PaginationState, createColumnHelper } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react'
import { GoHistory } from 'react-icons/go';

export interface PreviousHistoryRound {
  result: {
    tournament: {
        name: string;
        circuits: {
            id: number;
        }[];
        seasonId: number;
        start: number;
    };
  };
  opponent: {
      rankings: TeamRanking[];
      aliases: {
          code: string;
      }[];
  } | null;
  outcome: RoundOutcome;
  ballotsWon: number;
  ballotsLost: number;
  nameStd: string;
};

interface PreviousHistoryProps {
  data?: PreviousHistoryRound[];
  team1Code?: string;
  team2Code?: string;
};

const PreviousHistory = ({ data, team1Code, team2Code}: PreviousHistoryProps) => {
  const column = createColumnHelper<PreviousHistoryRound>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const totalPages = useMemo(() => Math.floor((data?.length || 0) / pagination.pageSize), [data, pagination.pageSize]);

  return (
    <Card icon={<GoHistory />} title="Past Matchups" className="max-w-[800px] mx-auto my-16">
      {
        data === undefined || data.length
          ? (
            <Table
              data={data}
              columnConfig={{
                core: [
                  column.accessor('result.tournament.name', {
                    header: "Tourn.",
                    cell: props => props.cell.getValue()
                  }),
                  column.accessor('result.tournament.start', {
                    header: "Date",
                    cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString()
                  }),
                  column.accessor('outcome', {
                    header: "Winner",
                    cell: props => props.cell.getValue() === "Split"
                      ? "Split"
                      : props.cell.getValue() === "Win"
                        ? team1Code
                        : team2Code
                  }),
                ] as ColumnDef<PreviousHistoryRound>[],
                md: [
                  column.accessor('nameStd', {
                    header: "Round",
                    cell: props => props.cell.getValue()
                  }),
                  column.display({
                    header: "Decision",
                    cell: props => {
                      const { ballotsWon, ballotsLost, outcome } = props.row.original;
                      if (outcome === "Win") {
                        return `${ballotsWon}-${ballotsLost}`;
                      } else {
                        return `${ballotsLost}-${ballotsWon}`;
                      }
                    }
                  })
                ] as ColumnDef<PreviousHistoryRound>[]
              }}
              numLoadingRows={3}
              paginationConfig={{
                pagination,
                setPagination,
                totalPages: totalPages >= 1 ? totalPages : 1
              }}
            />
          )
          : (
            <p className="text-sm text-red-400 text-center max-w-[500px] mx-auto">
              {team1Code} and {team2Code} have never faced each other.
            </p>
          )
      }
    </Card>
  )
}

export default PreviousHistory