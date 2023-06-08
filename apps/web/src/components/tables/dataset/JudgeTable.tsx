import React, { useMemo, useState } from 'react'
import { Card, Table } from '@shared/components'
import { Judge, JudgeRanking } from '@shared/database';
import { TbGavel } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';
import { getAvg } from '@src/utils/get-statistics';

type ExpandedJudgeRanking = (JudgeRanking & {
  judge: Judge & {
    records: {
      id: number;
      avgSpeakerPoints: number | null;
    }[];
  };
});

interface JudgeTableProps {
  count: number
}

const JudgeTable = ({ count }: JudgeTableProps) => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const { query, isReady, ...router } = useRouter();
  const { data } = trpc.dataset.judges.useQuery(
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
  const column = createColumnHelper<ExpandedJudgeRanking>();

  return (
    <Card icon={<TbGavel />} title="Judges" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('index', {
              header: "Index",
              cell: props => props.cell.getValue().toFixed(1),
            }),
            column.accessor('judge.name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
          ] as ColumnDef<ExpandedJudgeRanking>[],
          lg: [
            column.accessor('judge.records', {
              header: "Avg. Spks.",
              cell: props => {
                const points = props.row.original.judge.records
                  .filter(r => r.avgSpeakerPoints)
                  .map(r => r.avgSpeakerPoints) as number[];
                return points.length
                  ? getAvg(points).toFixed(1)
                  : '--'
              },
            }),
            column.accessor('judge.records', {
              header: "Rounds",
              cell: props => props.cell.getValue().length,
            }),
          ] as ColumnDef<ExpandedJudgeRanking>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: totalPages >= 1 ? totalPages : 1
        }}
        onRowClick={(row) => router.push({
          pathname: `/judges/${row.judge.id}`,
          query
        })}
        showPosition
      />
    </Card>
  )
}

export default JudgeTable
