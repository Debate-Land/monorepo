import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { Competitor } from '@shared/database';
import { BsPerson } from 'react-icons/bs'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type CompetitorTableRow = Competitor & {
  teams: {
      id: string;
  }[];
};

interface CompetitorTableProps {
  count: number
}

const CompetitorTable = ({count}: CompetitorTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.dataset.competitors.useQuery(
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
  const column = createColumnHelper<CompetitorTableRow>();

  return (
    <Card icon={<BsPerson />} title="Competitors" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('teams', {
              header: "Teams",
              cell: props => props.cell.getValue().length
            }),
          ] as ColumnDef<CompetitorTableRow>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: Math.ceil(count/pagination.pageSize)
        }}
        onRowClick={(row) => router.push(`/${query.event}/teams/${row.id}`)}
      />
    </Card>
    )
}

export default CompetitorTable
