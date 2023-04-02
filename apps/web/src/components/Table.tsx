import { Text } from '@shared/components';
import { Alias } from '@shared/database';
import { trpc } from '@src/utils/trpc';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, Row, SortingState, Table, useReactTable } from '@tanstack/react-table';
import React, { Fragment, useState, Dispatch, SetStateAction, useEffect } from 'react';

interface TableProps<T> {
  definition: Table<T>;
  child?: (props: { row: T }) => JSX.Element;
}

// FIXME: Row idx staying open after pagination...
// Opt-in pagination, expandable if appropriate column is supplied.
const Table = <T,>({ definition: table, child: ExpandedRow }: TableProps<T>) => {
  const currentPage = table.getState().pagination?.pageIndex;
  const tableIsSortable = table.getState().sorting;

  // console.log(tableIsSortable)

  useEffect(() => {
    table.resetExpanded(false);
  }, [table, currentPage]);

  return (
    <div>
      <table className="table-auto">
        <thead>
          {
            table.getHeaderGroups().map(
              headerGroup => (
                <tr key={headerGroup.id}>
                  {
                    headerGroup.headers.map(
                      header => (
                        <th
                          key={header.id}
                          onClick={
                            tableIsSortable && header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {
                            header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                          }
                          {
                            tableIsSortable && header.column.getCanSort()
                            ? {
                                asc: <FaSortUp className="ml-2"/>,
                                desc: <FaSortDown className="ml-2" />
                              }[header.column.getIsSorted() as string] ?? <FaSort className="ml-2" />
                            : null
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
                    row.getIsExpanded() && ExpandedRow && (
                      <tr>
                        <td colSpan={row.getVisibleCells().length}>
                          <ExpandedRow row={row.original} />
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
    </div>
  );
};

interface UseCustomTableOptions<T> {
  data: T[] | undefined;
  columns: ColumnDef<T>[];
  paginationConfig?: {
    paginationState: PaginationState;
    setPaginationState: Dispatch<SetStateAction<PaginationState>>;
    totalPages?: number;
  };
  sortingConfig?: {
    sortingState: SortingState;
    setSortingState: Dispatch<SetStateAction<SortingState>>;
  };
}

const useCustomTable = <T,>({ data, columns, paginationConfig, sortingConfig }: UseCustomTableOptions<T>) => (
  useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      ...(paginationConfig && { pagination: paginationConfig.paginationState }),
      ...(sortingConfig && { sorting: sortingConfig.sortingState})
    },
    ...(paginationConfig && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: paginationConfig.setPaginationState,
      manualPagination: true,
      pageCount: paginationConfig.totalPages || -1
    }),
    ...(sortingConfig && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: sortingConfig.setSortingState,
    })
  })
);

const getExpandingColumn = <T,>() => (
  {
    id: "expander",
    header: "Details",
    cell: ({ row }: { row: Row<T> }) => (
      row.getCanExpand()
        ? <button onClick={row.getToggleExpandedHandler()}>{row.getIsExpanded() ? '-' : '+'}</button>
        : <>--</>
    )
  } as ColumnDef<T>
);

// Testing

type Data = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
};

const SubComponent = ({row}: {row: Data}) => {
  const { data } = trpc.team.useQuery({
    event: 'PublicForum',
    id: row.team.id,
  });

  return data
    ? <>{JSON.stringify(data)}</>
    : <>Loading...</>
};

const LeaderboardTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data } = trpc.leaderboard.useQuery(
    {
      season: 2023,
      circuit: 11,
      page: pagination.pageIndex,
      limit: pagination.pageSize,
    },
    {
      keepPreviousData: true,
    }
  );

  const column = createColumnHelper<Data>();

  return <Table<Data>
    definition={
      useCustomTable({
        data,
        columns: [
          getExpandingColumn<Data>(),
          column.accessor("otr", {
            header: "OTR",
            cell: props => props.getValue().toFixed(3),
          }),
          column.accessor("team.aliases", {
            header: "Team",
            cell: props => props.getValue()[0].code,
            enableSorting: false,
          })
        ] as ColumnDef<Data>[],
        paginationConfig: {
          paginationState: pagination,
          setPaginationState: setPagination,
        },
        sortingConfig: {
          sortingState: sorting,
          setSortingState: setSorting
        }
      })
    }
    child={SubComponent}
  />
};

export default LeaderboardTable