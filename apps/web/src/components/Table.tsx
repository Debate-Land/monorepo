import { Text } from '@shared/components';
import { Alias } from '@shared/database';
import { trpc } from '@src/utils/trpc';
import { FaSort, FaSortUp, FaSortDown, FaChevronCircleDown, FaChevronCircleUp} from 'react-icons/fa';
import { FiChevronRight, FiChevronsRight, FiChevronLeft, FiChevronsLeft } from 'react-icons/fi';
import { ColumnDef, createColumnHelper, flexRender, getCoreRowModel, getExpandedRowModel, getPaginationRowModel, getSortedRowModel, PaginationState, Row, SortingState, useReactTable } from '@tanstack/react-table';
import React, { Fragment, useState, Dispatch, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { BiLinkExternal } from 'react-icons/bi';

const getPositionColumn = <T,>(pagination: PaginationState = { pageIndex: 0, pageSize: 0 }) => (
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
        ? <button onClick={row.getToggleExpandedHandler()} className="w-full flex flex-row items-center justify-start px-4">
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

const getOnClickColumn = <T,>() => (
  {
    id: "onClick",
    header: "Details",
    cell: () => <BiLinkExternal className="ml-4"/>
  } as ColumnDef<T>
);

interface TableProps<T> {
  data: T[] | undefined;
  columns: ColumnDef<T>[];
  paginationConfig?: {
    pagination: PaginationState;
    setPagination: Dispatch<SetStateAction<PaginationState>>;
    totalPages?: number;
  };
  sortingConfig?: {
    sorting: SortingState;
    setSorting: Dispatch<SetStateAction<SortingState>>;
  };
  child?: (props: { row: T }) => JSX.Element;
  showPosition?: boolean;
  onRowClick?: (row: T) => void;
}

const classNames = {
  table: "table-fixed bg-luka-200/20 rounded-lg mx-auto w-full text-sm",
  td: "py-3 px-2",
  th: "py-3 px-2 text-left",
  tr: "dark:text-gray-300 text-gray-700 border-t border-gray-100/80 dark:border-gray-700",
  pagination: {
    wrapper: "bg-luka-200/20 flex flex-row justify-between mx-auto mt-4 w-[300px] rounded-lg overflow-hidden",
    button: "hover:bg-luka-200/50 text-center w-[50px] text-xl py-3 flex items-center justify-center",
    textWrapper: "flex flex-row justify-center items-center w-[100px]",
  }
};

// TODO: Add page limit selection (10, 20, 50) after seeing how performance is impacted
const Table = <T,>({
  data,
  columns,
  paginationConfig,
  child: ExpandedRow,
  sortingConfig,
  onRowClick,
  showPosition,
}: TableProps<T>) => {
  if (showPosition) columns = [getPositionColumn(paginationConfig?.pagination), ...columns];
  if (ExpandedRow) columns = [getExpandingColumn(), ...columns];
  if (onRowClick) columns = [getOnClickColumn(), ...columns];

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    state: {
      ...(paginationConfig && { pagination: paginationConfig.pagination }),
      ...(sortingConfig && { sorting: sortingConfig.sorting })
    },
    ...(paginationConfig && {
      getPaginationRowModel: getPaginationRowModel(),
      onPaginationChange: paginationConfig.setPagination,
      manualPagination: true,
      pageCount: paginationConfig.totalPages || -1
    }),
    ...(sortingConfig && {
      getSortedRowModel: getSortedRowModel(),
      onSortingChange: sortingConfig.setSorting,
    }),
  });

  const currentPage = table.getState().pagination.pageIndex;
  const tableIsSortable = sortingConfig !== undefined;
  const tableIsPaginateable = paginationConfig !== undefined;

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
                  <tr
                    className={clsx(classNames.tr, { "hover:bg-luka-200/10 dark:hover:bg-luka-200/50 cursor-pointer": onRowClick})}
                    onClick={
                      onRowClick
                        ? () => onRowClick(row.original)
                        : undefined
                    }
                  >
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
              onClick={() => {table.setPageIndex(0)}}
              className={classNames.pagination.button}
            >
              <FiChevronsLeft/>
            </button>
            <button
              onClick={table.previousPage}
              disabled={currentPage == 1}
              className={classNames.pagination.button}
            >
              <FiChevronLeft/>
            </button>
            <div className={classNames.pagination.textWrapper}>
              <Text>{table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</Text>
            </div>
            <button
              onClick={table.nextPage}
              disabled={currentPage == table.getPageCount()}
              className={classNames.pagination.button}
            >
              <FiChevronRight/>
            </button>
            <button
              onClick={() => {table.setPageIndex(table.getPageCount())}}
              className={classNames.pagination.button}
            >
              <FiChevronsRight/>
            </button>
          </div>
        )
      }
    </div>
  );
};

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
    data={data}
    columns={
      [
        column.accessor("otr", {
          header: "OTR",
          cell: props => props.getValue().toFixed(3),
        }),
        column.accessor("team.aliases", {
          header: "Team",
          cell: props => props.getValue()[0].code,
          enableSorting: false,
        })
      ] as ColumnDef<Data>[]
    }
    paginationConfig={{
      pagination,
      setPagination
    }}
    sortingConfig={{
      sorting,
      setSorting
    }}
    child={SubComponent}
    onRowClick={(r) => alert(r.team.aliases[0].code + ' was clicked!')}
    showPosition
  />
};

export default LeaderboardTable;
