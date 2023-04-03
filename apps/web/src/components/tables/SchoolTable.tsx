import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { School } from '@shared/database';
import { MdOutlineSchool } from 'react-icons/md'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type SchoolTableRow = School & {
  tournamentResults: {
      id: number;
  }[];
}

interface SchoolTableProps {
  count: number
}

const SchoolTable = ({count}: SchoolTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.schools.useQuery(
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
  const column = createColumnHelper<SchoolTableRow>();

  return (
    <Card icon={<MdOutlineSchool />} title="Schools" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('tournamentResults', {
              header: "Results",
              cell: props => props.cell.getValue().length
            }),
          ] as ColumnDef<SchoolTableRow>[]
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

export default SchoolTable
