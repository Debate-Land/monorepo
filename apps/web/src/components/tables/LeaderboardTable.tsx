import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { Alias } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type LeaderboardRow = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
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
    <Card icon={<TbListDetails />} title="Leaderboard" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columns={
          [
            column.accessor('otr', {
              header: "OTR",
              cell: props => props.getValue().toFixed(3)
            }),
            column.accessor('team.aliases', {
              header: "Team",
              cell: props => props.getValue()[0].code
            })
          ] as ColumnDef<LeaderboardRow>[]
        }
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
