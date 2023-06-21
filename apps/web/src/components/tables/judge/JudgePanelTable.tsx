import React, { useMemo } from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper, SortingState } from '@tanstack/react-table'
import { ExpandedJudgeRecord } from './JudgeRecordsTable';
import { useRouter } from 'next/router';
import omit from 'lodash/omit';

export interface JudgePanelTableProps {
  data: ExpandedJudgeRecord;
}

const JudgePanelTable = ({ data }: JudgePanelTableProps) => {
  const { query, ...router } = useRouter();
  const records = useMemo(() => data.rounds[0].records, [data]);
  const column = createColumnHelper<typeof records[0]>();

  return (
    <div>
      <Text className="text-xl font-bold dark:text-gray-300 text-gray-700 mb-1">Panel Decision</Text>
      {
        records.length > 1
          ? (
            <Table
              data={records}
              numLoadingRows={5}
              columnConfig={{
                core: [
                  column.accessor('judge.name', {
                    header: "Judge",
                    cell: props => props.cell.getValue()
                  }),
                  column.accessor('decision', {
                    header: "Side",
                    cell: props => props.cell.getValue()
                  }),
                ] as ColumnDef<typeof records[0]>[],
              }}
              onRowClick={(row) => router.push({
                pathname: `/judges/${row.judge.id}`,
                query: omit(query, ['id', 'topics', 'topicTags'])
              })}
            />
          )
          : (
            <div className="w-full flex justify-center dark:text-gray-300 text-gray-700 pb-3">
              <Text>
                No panel decision available.
              </Text>
            </div>
          )
      }

    </div>

  )
}

export default JudgePanelTable;
