import { Text } from '@shared/components';
import { Alias } from '@shared/database';
import { trpc } from '@src/utils/trpc'
import { createColumnHelper, ExpandedState, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, PaginationState, Row, useReactTable } from '@tanstack/react-table';
import React, { Fragment, useMemo, useState } from 'react'

type Data = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
};

interface TableProps {
  renderSubComponent?: ({row}: {row: Row<Data>}) => JSX.Element;
}

interface SubComponentProps {
  row: Data
}

const SubComponent = ({row}: SubComponentProps) => {
  const { data } = trpc.team.useQuery({
    event: 'PublicForum',
    id: row.team.id,
  });

  return data
    ? <>{JSON.stringify(data)}</>
    : <>Loading...</>
};

const Table = ({renderSubComponent: _}: TableProps) => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  // const [expanded, setExpanded] = useState<ExpandedState>({});

  const { data } = trpc.leaderboard.useQuery(
    {
      season: 2023,
      circuit: 11,
      page: pageIndex,
      limit: pageSize,
    },
    {
      keepPreviousData: true,
    }
  );

  const pagination = useMemo(() => ({
    pageIndex,
    pageSize
  }), [pageIndex, pageSize]);

  const column = createColumnHelper<Data>();

  const columns = [
    column.display({
      id: "expander",
      header: "Details",
      cell: ({ row }) => (
        row.getCanExpand()
          ? <button onClick={row.getToggleExpandedHandler()}>{row.getIsExpanded() ? '-' : '+'}</button>
          : <>--</>
      )
    }),
    column.accessor("otr", {
      header: "OTR",
      cell: props => props.getValue().toFixed(3)
    }),
    column.accessor("team.aliases", {
      header: "Team",
      cell: props => props.getValue()[0].code
    })
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    pageCount: -1,
    state: {
      pagination,
      // expanded
    },
    onPaginationChange: setPagination,
    // onExpandedChange: setExpanded,
    manualPagination: true,
  });

  return (
    <>
    <table className="table-auto">
      <thead>
        {
          table.getHeaderGroups().map(
            headerGroup => (
              <tr key={headerGroup.id}>
                {
                  headerGroup.headers.map(
                    header => (
                      <th key={header.id}>
                        {
                          header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )
                        }
                      </th>
                    )
                  )
                }
              </tr>
            )
          )
        }
      </thead>
      <tbody>
        {
          table.getRowModel().rows.map(
            row => (
              <Fragment key={row.id}>
                {/* Actual table row */}
                <tr>
                  {
                    row.getVisibleCells().map(
                      cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      )
                    )
                  }
                </tr>
                {/* Expanded data housed in additional row, if available */}
                {
                  row.getIsExpanded() && (
                    <tr>
                      <td colSpan={row.getVisibleCells().length}>
                        <SubComponent row={row.original} />
                      </td>
                    </tr>
                  )
                }
              </Fragment>
            )
          )
        }
      </tbody>
      <tfoot>
        {
          table.getFooterGroups().map(
            footerGroup => (
              <tr key={footerGroup.id}>
                {
                  footerGroup.headers.map(
                    header => (
                      <th key={header.id}>
                        {
                          header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )
                        }
                      </th>
                    )
                  )
                }
              </tr>
            )
          )
        }
      </tfoot>
      </table>
      <button onClick={table.previousPage}>{'<'}</button>
      <button onClick={table.nextPage}>{'>'}</button>
      <Text>Page {table.getState().pagination.pageIndex + 1} of --</Text>

    </>
  )
}

export default Table