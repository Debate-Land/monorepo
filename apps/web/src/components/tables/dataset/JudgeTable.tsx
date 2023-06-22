import React, { useState } from 'react'
import { Card, Table } from '@shared/components'
import { TbGavel } from 'react-icons/tb'
import { useRouter } from 'next/router';
import { trpc } from '@src/utils/trpc';
import { ColumnDef, createColumnHelper, PaginationState } from '@tanstack/react-table';

type ExpandedJudgeRanking = {
  circuitRank: number;
  judge_id: string;
  name: string;
  index: number;
  numRounds: number;
  avgSpeakerPoints: number | null;
};

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
  const column = createColumnHelper<ExpandedJudgeRanking>();

  return (
    <Card icon={<TbGavel />} title="Judges" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={10}
        columnConfig={{
          core: [
            column.accessor('circuitRank', {
              header: "Pos.",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('index', {
              header: "Index",
              cell: props => props.cell.getValue().toFixed(1),
            }),
            column.accessor('name', {
              header: "Name",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('numRounds', {
              header: "Rounds",
              cell: props => Math.round(props.cell.getValue()),
            }),
          ] as ColumnDef<ExpandedJudgeRanking>[],
          lg: [
            column.accessor('avgSpeakerPoints', {
              header: "Avg. Spks",
              cell: props => props.cell.getValue()
                ? (props.cell.getValue() as number).toFixed(1)
                : '--',
            }),
          ] as ColumnDef<ExpandedJudgeRanking>[]
        }}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: Math.floor(count / pagination.pageSize)
        }}
        onRowClick={(row) => router.push({
          pathname: `/judges/${row.judge_id}`,
          query
        })}
      />
    </Card>
  )
}

export default JudgeTable
