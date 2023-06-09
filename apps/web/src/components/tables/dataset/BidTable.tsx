import React, { useMemo, useState } from 'react'
import { Card, Table, Text } from '@shared/components'
import { IoMedalOutline } from 'react-icons/io5'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';
import { Event } from '@shared/database';

type BidTableRow = {
  teamId: string;
  code: string;
  fullBids: number;
  partialBids: number;
};

interface BidTableProps {
  event?: Event;
};

const BidTable = ({ event }: BidTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.dataset.bids.useQuery(
    {
      season: parseInt(query.season as unknown as string),
      circuit: parseInt(query.circuit as unknown as string),
    },
    {
      keepPreviousData: true,
      enabled: isReady
    }
  );
  const totalPages = useMemo(() => Math.floor((data?.length || 0)/pagination.pageSize), [data?.length, pagination.pageSize]);
  const column = createColumnHelper<BidTableRow>();

  return (
    <Card icon={<IoMedalOutline />} title="Bids" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data?.slice(pagination.pageSize * pagination.pageIndex, pagination.pageSize * (pagination.pageIndex + 1))}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('code', {
              header: "Team",
              cell: props => props.cell.getValue()
            }),
            column.accessor('fullBids', {
              header: "Full Bids",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<BidTableRow>[],
          sm: [
            column.accessor('partialBids', {
              header: "Partial Bids",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<BidTableRow>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: totalPages >= 1 ? totalPages : 1
        }}
        onRowClick={(row) => router.push({
          pathname: `/teams/${row.teamId}`,
          query
        })}
        showPosition
        sortable
      />
      <Text className='mx-auto text-center'>
        {data?.filter(r => r['fullBids'] >= 2).length} {event == 'PublicForum' ? 'gold' : ''} {event && 'qualifying teams'}.
        {
          event == 'PublicForum' &&
            ` ${data?.filter(r => r['fullBids'] < 2 && (r['fullBids'] == 1 || r['partialBids'] == 2)).length} silver qualifying teams.`
        }
      </Text>
    </Card>
    )
}

export default BidTable
