import React, { useState } from 'react'
import { Card, Table, Text } from '@shared/components'
import { IoMedalOutline } from 'react-icons/io5'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type BidTableRow = {
  teamId: string;
  code: string;
  fullBids: number;
  partialBids: number;
};

const BidTable = () => {
  // const [pagination, setPagination] = useState<PaginationState>({
  //   pageIndex: 0,
  //   pageSize: 10
  // });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.dataset.bids.useQuery(
    {
      season: parseInt(query.season as unknown as string),
      circuit: parseInt(query.circuit as unknown as string),
      // limit: pagination.pageSize,
      // page: pagination.pageIndex
    },
    {
      keepPreviousData: true,
      enabled: isReady
    }
  );
  const column = createColumnHelper<BidTableRow>();

  return (
    <Card icon={<IoMedalOutline />} title="Bids" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
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
            }),
            column.accessor('partialBids', {
              header: "Partial Bids",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<BidTableRow>[]
        }}
        // paginationConfig={{
        //   pagination,
        //   setPagination,
        //   totalPages: Math.ceil(count/pagination.pageSize)
        // }}
        onRowClick={(row) => router.push(`/teams/${row.teamId}?event=${query.event}`)}
        sortable
      />
      <Text className='mx-auto'>
        {data?.filter(r => r['fullBids'] >= 2).length} {query.event == 'PublicForum' ? 'gold' : ''} qualifying teams.
        {
          query.event == 'PublicForum' &&
            ` ${data?.filter(r => r['fullBids'] < 2 && (r['fullBids'] == 1 || r['partialBids'] == 2)).length} silver qualifying teams.`
        }
      </Text>
    </Card>
    )
}

export default BidTable
