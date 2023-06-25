import React, { useMemo, useState } from 'react'
import { Card, Table, Text } from '@shared/components'
import { IoMedalOutline } from 'react-icons/io5'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';
import { Event } from '@shared/database';

export type BidTableRow = {
  bidRank: number;
  teamId: string;
  code: string;
  numFull: number;
  numPartial: number;
};

interface BidTableProps {
  event?: Event;
  numGoldQualifiers?: number;
  numSilverQualifiers?: number;
};

const BidTable = ({ event, numGoldQualifiers, numSilverQualifiers }: BidTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.dataset.bids.useQuery(
    {
      season: parseInt(query.season as unknown as string),
      circuit: parseInt(query.circuit as unknown as string),
      page: pagination.pageIndex,
      limit: pagination.pageSize
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const totalPages = useMemo(() => Math.ceil(((numGoldQualifiers || 0) + (numSilverQualifiers || 0))/pagination.pageSize), [numGoldQualifiers, numSilverQualifiers, pagination.pageSize]);
  const column = createColumnHelper<BidTableRow>();

  return (
    <Card icon={<IoMedalOutline />} title="Bids" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('bidRank', {
              header: "Rank",
              cell: props => props.cell.getValue()
            }),
            column.accessor('code', {
              header: "Team",
              cell: props => props.cell.getValue()
            }),
            column.accessor('numFull', {
              header: "Full Bids",
              cell: props => props.cell.getValue()
            })
          ] as ColumnDef<BidTableRow>[],
          sm: [
            column.accessor('numPartial', {
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
        sortable
      />
      {
        event && (
          <Text className='mx-auto text-center'>
            {numGoldQualifiers} {event === 'PublicForum' ? 'Gold Qualifiers' : 'Qualifiers'}. {event === 'PublicForum' && `${numSilverQualifiers} Silver Qualifiers.`}
          </Text>
        )
      }

    </Card>
    )
}

export default BidTable
