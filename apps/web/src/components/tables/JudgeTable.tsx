import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { Judge } from '@shared/database';
import { TbListDetails } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type JudgeTableRow = Judge & {
  records: {
      id: number;
  }[];
}

interface JudgeTableProps {
  count: number
}

const JudgeTable = ({count}: JudgeTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const {query, isReady, ...router} = useRouter();
  const { data } = trpc.judges.useQuery(
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
  const column = createColumnHelper<JudgeTableRow>();

  return (
    <Card icon={<TbListDetails />} title="Judges" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        columns={
          [
            column.accessor('name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('records', {
              header: "Rounds",
              cell: props => props.cell.getValue().length
            }),
          ] as ColumnDef<JudgeTableRow>[]
        }
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

export default JudgeTable
