import React from 'react'
import { Table } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { Circuit, Season } from '@shared/database';
import getEventName from '@src/utils/get-event-name';

type ExpandedCircuit = Circuit & {
  seasons: Season[];
};

export interface CircuitDetailsTableProps {
  data?: ExpandedCircuit[];
}

const CircuitDetailsTable = ({ data }: CircuitDetailsTableProps) => {
  const column = createColumnHelper<ExpandedCircuit>();

  return (
    <Table
      data={data}
      numLoadingRows={5}
      columnConfig={{
        core: [
          column.accessor('name', {
            header: "Circuit",
            cell: props => props.cell.getValue()
          }),
          column.accessor('event', {
            header: "Event",
            cell: props => getEventName(props.cell.getValue())
          }),
        ] as ColumnDef<ExpandedCircuit>[],
        lg: [
          column.accessor('seasons', {
            header: "Seasons",
            cell: props => props.cell.getValue()
              .map(c => c.id)
              .sort((a, b) => a - b)
              .join(', ')
          }),
        ] as ColumnDef<ExpandedCircuit>[],
      }}
    />
  )
}

export default CircuitDetailsTable
