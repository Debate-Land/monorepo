import React from 'react'
import { BsJournalBookmark } from 'react-icons/bs'
import { Table, Card } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Alias, Circuit, Season } from '@shared/database';
import { useRouter } from 'next/router';
import CircuitDetailsTable from './CircuitDetailsTable';
import { omit } from 'lodash';

export interface ExpandedTeam {
  id: string;
  _count: {
    results: number;
  };
  circuits: (Circuit & {
    seasons: Season[];
  })[];
  seasons: Season[];
  aliases: Alias[];
}

export interface CompetitorHistoryTableProps {
  data?: ExpandedTeam[];
}

const CompetitorHistoryTable = ({ data }: CompetitorHistoryTableProps) => {
  const column = createColumnHelper<ExpandedTeam>();
  const { query, ...router } = useRouter();

  return (
    <Card icon={<BsJournalBookmark />} title="Competitive History" className="max-w-[800px] mx-auto my-16">
      <Table
        data={data}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.accessor('aliases', {
              header: "Code",
              cell: props => props.cell.getValue()[0].code
            }),
            column.accessor('_count.results', {
              header: "# Tourns.",
              cell: props => props.cell.getValue()
            }),
          ] as ColumnDef<ExpandedTeam>[],
          md: [
            column.accessor('circuits', {
              header: "Circuits",
              cell: props => <CircuitDetailsTable data={props.cell.getValue()} />
            }),
          ] as ColumnDef<ExpandedTeam>[],
        }}
        onRowClick={({ id }) => router.push({
          pathname: `/teams/${id}`,
          query: omit(query, 'id')
        })}
        sortable
      />
    </Card>
  )
}

export default CompetitorHistoryTable
