import { Text } from '@shared/components';
import { Alias } from '@shared/database';
import { trpc } from '@src/utils/trpc';
import { FaSort, FaSortUp, FaSortDown, FaChevronCircleDown, FaChevronCircleUp} from 'react-icons/fa';

import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, Row, SortingState, Table, useReactTable } from '@tanstack/react-table';
import React, { Fragment, useState, Dispatch, SetStateAction, useEffect } from 'react';

interface TableProps<T> {
  definition: Table<T>;
  child?: (props: { row: T }) => JSX.Element;
  sortable?: boolean;
  paginateable?: boolean;
}

const classNames = {
  table: "table-auto bg-luka-200/20 rounded-lg mx-auto",
  td: "py-3 px-2",
  th: "py-3 px-2 text-left",
  tr: "dark:text-gray-300 text-gray-700 border-t border-gray-100 dark:border-gray-700",
  pagination: {
    wrapper: "bg-luka-200/20 flex flex-row justify-between mx-auto mt-4 w-[200px] rounded-lg overflow-hidden",
    button: "hover:bg-luka-200/50 text-center w-[50px] text-xl py-3",
    textWrapper: "flex items-center",
  }
}

/* TODO: Move useCustomTable inside of here and have props be passed down to the table component directly?
/* Then we can make expandable column as idx 0, position column as idx 1, etc... automagically.
*/
const Table = <T,>({ definition: table, child: ExpandedRow, sortable: tableIsSortable, paginateable: tableIsPaginateable }: TableProps<T>) => {
  const currentPage = table.getState().pagination.pageIndex;

  useEffect(() => {
    table.resetExpanded(false);
  }, [table, currentPage]);

  return (
    <div>
      <table className={classNames.table}>
        <thead>
          {
            table.getHeaderGroups().map(
              headerGroup => (
                <tr key={headerGroup.id} className={classNames.tr}>
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
                          className={classNames.th}
                        >
                          <span className="flex items-center mr-2">
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
                                  asc: <FaSortUp className="ml-1"/>,
                                  desc: <FaSortDown className="ml-1" />
                                }[header.column.getIsSorted() as string] ?? <FaSort className="ml-1" />
                              : null
                            }
                          </span>
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
                  <tr className={classNames.tr}>
                    {
                      row.getVisibleCells().map(
                        cell => (
                          <td key={cell.id} className={classNames.td}>
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
      {
        tableIsPaginateable && (
          <div className={classNames.pagination.wrapper}>
            <button
              onClick={table.previousPage}
              className={classNames.pagination.button}
            >
              {'<'}
            </button>
            <div className={classNames.pagination.textWrapper}>
              <Text>{table.getState().pagination.pageIndex + 1} of --</Text>
            </div>
            <button
              onClick={table.nextPage}
              className={classNames.pagination.button}
            >
              {'>'}
            </button>
          </div>
        )
      }
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

const getPositionColumn = <T,>(pagination: PaginationState) => (
  {
    id: "position",
    header: "Pos.",
    cell: ({ row }: { row: Row<T> }) => pagination.pageIndex * pagination.pageSize + row.index + 1
  }
);

const getExpandingColumn = <T,>() => (
  {
    id: "expander",
    header: "Details",
    cell: ({ row }: { row: Row<T> }) => (
      row.getCanExpand()
        ? <button onClick={row.getToggleExpandedHandler()}>
          {
            row.getIsExpanded()
              ? <FaChevronCircleUp/>
              : <FaChevronCircleDown/>
          }
        </button>
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
          getPositionColumn<Data>(pagination),
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
    sortable
    paginateable
  />
};

export default LeaderboardTable;
