import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { Alias } from '@shared/database';
import { BsTrophy } from 'react-icons/bs'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type LeaderboardRow = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
  statistics: {
    pWp: number;
    tWp: number;
    avgRawSpeaks: number;
    avgOpWpM: number;
  };
}

interface LeaderboardTableProps {
  count: number
}

const LeaderboardTable = ({count}: LeaderboardTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.leaderboard.useQuery(
    {
      season: parseInt(query.season as unknown as string),
      circuit: parseInt(query.circuit as unknown as string),
      limit: pagination.pageSize,
      page: pagination.pageIndex
    },
    {
      keepPreviousData: true,
      enabled: isReady
    }
  );
  const column = createColumnHelper<LeaderboardRow>();

  return (
    <Card icon={<BsTrophy />} title="Leaderboard" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columnConfig={{
          core: [
            column.accessor('otr', {
              header: "OTR",
              cell: props => props.getValue().toFixed(3)
            }),
            column.accessor('team.aliases', {
              header: "Team",
              cell: props => props.getValue()[0].code
            })
          ] as ColumnDef<LeaderboardRow>[],
          sm: [
            column.accessor('statistics.pWp', {
              header: "Prelim Win %",
              cell: props => (props.cell.getValue() * 100).toFixed(1) + '%'
            }),
            column.accessor('statistics.tWp', {
              header: "True Win %",
              cell: props => (props.cell.getValue() * 100).toFixed(1) + '%'
            })
          ] as ColumnDef<LeaderboardRow>[],
          lg: [
            column.accessor('statistics.avgOpWpM', {
              header: "Avg. OpWpM",
              cell: props => (props.cell.getValue()*100).toFixed(1) + '%'
            }),
            column.accessor('statistics.avgRawSpeaks', {
              header: "Avg. Spks.",
              cell: props => props.cell.getValue().toFixed(1)
            }),
          ] as ColumnDef<LeaderboardRow>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: Math.ceil(count/pagination.pageSize)
        }}
        onRowClick={(row) => router.push(`/${query.event}/teams/${row.team.id}`)}
        showPosition
      />
    </Card>
    )
}

export default LeaderboardTable
