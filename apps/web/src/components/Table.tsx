import { Alias } from '@shared/database';
import { trpc } from '@src/utils/trpc'
import { createColumnHelper, flexRender, getCoreRowModel, PaginationState, useReactTable } from '@tanstack/react-table';
import React, { useMemo, useState } from 'react'

type Data = {
  team: {
    id: string;
    aliases: Alias[];
  };
  otr: number;
};

const Table = () => {
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

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
    pageCount: -1,
    state: {
      pagination
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  })

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
              <tr key={row.id}>
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

    </>
  )
}

export default Table