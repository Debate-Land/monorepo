import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { School, Tournament } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type TournamentTableRow = Tournament & {
  _count: {
      results: number;
  };
}

interface TournamentTableProps {
  count: number
}

const TournamentTable = ({count}: TournamentTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.tournament.useQuery(
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
  const column = createColumnHelper<TournamentTableRow>();

  return (
    <Card icon={<TbListDetails />} title="Leaderboard" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columns={
          [
            column.accessor('name', {
              header: "Name",
              cell: props => props.getValue()
            }),
            column.accessor('start', {
              header: "Start",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
            column.accessor('_count.results', {
              header: "Entries",
              cell: props => props.getValue()
            })
          ] as ColumnDef<TournamentTableRow>[]
        }
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: Math.ceil(count/pagination.pageSize)
        }}
        onRowClick={(row) => router.push(`/${query.event}/teams/${row.team.id}`)}
      />
    </Card>
    )
}

export default TournamentTable
