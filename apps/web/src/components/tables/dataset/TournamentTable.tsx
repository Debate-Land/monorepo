import React, { useMemo, useState } from 'react'
import { Card, Table } from '@shared/components'
import { Tournament } from '@shared/database';
import { useRouter } from 'next/router';
import { AiOutlineCalendar } from 'react-icons/ai';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type TournamentTableRow = Tournament & {
  _count: {
      teamResults: number;
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
  const { data } = trpc.dataset.tournaments.useQuery(
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
  const totalPages = useMemo(() => Math.floor((data?.length || 0)/pagination.pageSize), [data?.length, pagination.pageSize]);
  const column = createColumnHelper<TournamentTableRow>();

  return (
    <Card icon={<AiOutlineCalendar />} title="Tournaments" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('name', {
              header: "Name",
              cell: props => props.getValue()
            }),
            column.accessor('start', {
              header: "Date",
              cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString("en-us")
            }),
          ] as ColumnDef<TournamentTableRow>[],
          sm: [
            column.accessor('_count.teamResults', {
              header: "Entries",
              cell: props => props.getValue()
            })
          ] as ColumnDef<TournamentTableRow>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: totalPages >= 1 ? totalPages : 1
        }}
        // onRowClick={(row) => router.push(`/${query.event}/teams/${row.id}`)}
      />
    </Card>
    )
}

export default TournamentTable
