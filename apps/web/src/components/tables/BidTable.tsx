import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { Prisma } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type BidTableRow = {
  _sum: {
    bid: number
  };
  teamId: string;
  code: string;
};

interface BidTableProps {
  count: number
}

const BidTable = ({count}: BidTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.bids.useQuery(
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
  const column = createColumnHelper<BidTableRow>();

  return (
    <Card icon={<TbListDetails />} title="Bids" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columns={
          [
            column.accessor('code', {
              header: "Team",
              cell: props => props.cell.getValue()
            }),
            column.accessor('_sum.bid', {
              header: "Bids",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<BidTableRow>[]
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

export default BidTable
