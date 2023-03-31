/* eslint-disable */
import clsx from 'clsx'
import React from 'react'
import Button from './Button'
import Text from './Text'
import omit from 'lodash/omit'
import { AiOutlineArrowDown, AiOutlineArrowLeft, AiOutlineArrowRight, AiOutlineArrowUp, AiOutlineBackward, AiOutlineForward } from 'react-icons/ai'

type Priority = 'sm' | 'md' | 'lg' | 'xl'

const collapseConfig = (priority: Priority | undefined) => {
  if (!priority) return ''
  return `hidden ${priority}:inline-block`
}

export interface TableAttributeProps<T> {
  header: string
  description?: string // Mouseover description of the attribute
  priority?: Priority // Used for collapsing columns at different widths
  value: {
    literal: number | string | ((data: T) => number | string) // Used for sorting, and display (if value.display is not supplied)
    display?: (data: T) => JSX.Element // Preferred over value.literal if supplied
    percentage?: boolean // If true, value.literal is shown as a percentage
  }
  sortable?: boolean // Default false, reccomended for numeric values
  summarizable?: boolean // Default false, reccomended for numeric values
}

export const TableAttribute = <T,>(props: TableAttributeProps<T>) => <></>

export interface TableBodyProps<T> {
  // Array IFF not paginated, Function IFF paginated
  data: T[] | ((page: number, limit: number) => T[])
  children: React.ReactElement<TableAttributeProps<T>>[]
  expand?: (data: T) => JSX.Element // Expandable row, toggles on click
  onClick?: (data: T) => void // Handle row click
  pagination?: {
    limit: number // Number of rows per page
    getTotalPages: (limit: number, page: number) => number // Function to get total number of pages
    page?: number // Customize starting page
  }
  initialOpen?: number // Row index to open by default
  summary?: boolean // Show summary row at bottom of table, defaults to false.
  className?: {
    wrapper?: string
    table?: string
    thead?: string
    trHeader?: string
    tbody?: string
    tr?: string
    th?: string
    td?: string
    thSummary?: string
    tdSummary?: string
    tfoot?: string
  }
}

export const TableBody = <T,>({
  data: resolveable,
  children: attributes,
  expand,
  onClick,
  pagination: initialPagination,
  initialOpen,
  summary: showSummary,
  className
}: TableBodyProps<T>) => {
  let getTotalPages: any;
  initialPagination
    ? (getTotalPages = initialPagination.getTotalPages)
    : (getTotalPages = (limit: number, page: number) => -1)

  const [data, setData] = React.useState<T[]>([])
  const [sorted, setSorted] = React.useState<{ index: number; ascending: boolean }>({ index: 0, ascending: true })
  const [pagination, setPagination] = React.useState<{ page: number, limit: number, totalPages: number }>({
    page: 0,
    totalPages: -1,
    ...omit(initialPagination, 'getTotalPages')
  })
  const [lastClicked, setLastClicked] = React.useState<number | null>(initialOpen !== undefined ? initialOpen : null)

  const updateSorted = (index: number) => {
    if (sorted.index === index) {
      setSorted({ index, ascending: !sorted.ascending })
    } else {
      setSorted({ index, ascending: true })
    }
  }

  React.useEffect(() => {
    data.sort((a, b) => {
      const attribute = attributes[sorted.index]
      const valueA = attribute.props.value.literal
      const valueB = attribute.props.value.literal
      const aVal = typeof valueA === 'function' ? valueA(a) : valueA
      const bVal = typeof valueB === 'function' ? valueB(b) : valueB
      if (aVal > bVal) return sorted.ascending ? 1 : -1
      if (aVal < bVal) return sorted.ascending ? -1 : 1
      return 0
    })
  }, [sorted])

  React.useEffect(() => {
    typeof resolveable === 'function'
      ? setData(resolveable(pagination.page, pagination.limit))
      : setData(resolveable)

    initialPagination && setPagination({
      ...pagination,
      totalPages: getTotalPages(pagination.limit, pagination.page)
    })
  }, [resolveable, pagination.limit, pagination.page])

  let summary: { [key: string]: number[] | null } = {}

  return (
    <div className="flex flex-col items-center">
      <div className={clsx(
        'inline-block rounded-sm border border-gray-300/40 mx-auto my-4 w-full',
        className?.wrapper
      )}>
        <table className={clsx(
          'table-auto border-collapse w-full',
          className?.table
        )}>
          <thead className={clsx(
            className?.thead,
          )}>
            <tr className={clsx(
              'bg-stone-300/50 rounded-xl',
              className?.trHeader
            )}>
              {
                attributes.map(({ props: attribute }, idx) => {
                  return (
                    <Text
                      key={attribute.header}
                      as="th"
                      size="sm"
                      onClick={() => attribute.sortable && updateSorted(idx)}
                      className={clsx(
                        'text-left uppercase font-extrabold p-1',
                        collapseConfig(attribute.priority)
                      )}
                      {
                      ...attribute.description && {
                        tooltip: attribute.description,
                      }
                      }
                    >
                      <span className={clsx(
                        "flex space-x-2 items-center",
                        { 'dark:hover:text-sky-200 hover:text-sky-400': attribute.sortable }
                      )} >
                        {attribute.header}
                        {
                          attribute.sortable && sorted.index === idx ?
                            sorted.ascending
                              ? <AiOutlineArrowDown />
                              : <AiOutlineArrowUp />
                            : null
                        }
                      </span>
                    </Text>
                  )
                })
              }
            </tr>
          </thead>
          <tbody className={clsx()}>
            {
              data.map((rowData, idx) => {
                // Rendering <tr>
                return (
                  <>
                    <tr
                      onClick={() => {
                        expand && lastClicked === idx
                          ? setLastClicked(null)
                          : setLastClicked(idx)
                        onClick?.(rowData)
                      }}
                      className={clsx(
                        'hover:bg-luka-100/20 border-gray-300/40',
                        {
                          'border-b': idx !== data.length - 1,
                          'border-b border-dashed': expand && idx === lastClicked,
                          'bg-stone-300/40': idx % 2 !== 0,
                          'bg-white dark:bg-stone-900': !expand && !onClick && idx % 2 === 0,
                        },
                        className?.tr
                      )}
                    >
                      {
                        attributes.map(({ props: attribute }) => {
                          const value = typeof attribute.value.literal === 'function'
                            ? attribute.value.literal(rowData)
                            : attribute.value.literal

                          if (typeof value === 'number') {
                            if (
                              Object.keys(summary).includes(attribute.header)
                              && attribute.summarizable
                              && Array.isArray(summary[attribute.header])
                            ) {
                              // @ts-ignore
                              summary[attribute.header][0] += value
                              // @ts-ignore
                              summary[attribute.header][1] += 1
                            }
                            else if (attribute.summarizable) {
                              summary[attribute.header] = [value, 1]
                            }
                            if (!Object.keys(summary).includes(attribute.header) && !attribute.summarizable) {
                              summary[attribute.header] = null
                            }
                          }

                          // Rendering <td>
                          return <td className={clsx(
                            'p-1 text-sm md:text-md',
                            collapseConfig(attribute.priority),
                            className?.td
                          )}>
                            {
                              attribute.value.display
                                ? attribute.value.display(rowData)
                                : attribute.value.percentage
                                  ? (value as unknown as number * 100).toFixed(1) + '%'
                                  : value
                            }
                          </td>
                        })
                      }
                    </tr>
                    {
                      expand &&
                      (
                        <tr className={clsx(
                          'w-full',
                          {
                            'hidden': idx !== lastClicked,
                            'border-b border-gray-300/40': idx !== data.length - 1 && idx === lastClicked,
                          }
                        )}>
                          <td colSpan={attributes.length} className="p-1">
                            {expand(rowData)}
                          </td>
                        </tr>
                      )
                    }
                  </>
                )
              })
            }
          </tbody>
          <tfoot className={clsx(className?.tfoot)}>
            {
              showSummary && (
                <tr className={clsx(
                  'bg-stone-300/50 rounded-xl',
                  className?.thSummary
                )}>
                  <td className={clsx(
                    'text-left uppercase font-extrabold',
                    className?.th
                  )}>
                    <Text size="sm" className="p-1">TOTALS</Text>
                  </td>
                  {
                    Object.keys(summary).map((key, idx) => {
                      return idx == 0
                        ? null
                        : (
                          <td className={clsx(
                            collapseConfig(
                              attributes.map(({ props: attribute }) => {
                                if (attribute.header === key) return attribute.priority
                              })[0],
                            ),
                            className?.tdSummary
                          )}>
                            {
                              Array.isArray(summary[key])
                                // @ts-ignore
                                ? (summary[key][0] / summary[key][1]).toFixed(2)
                                : '-'
                            }
                          </td>
                        )
                    })
                  }
                </tr>
              )
            }
          </tfoot>
        </table>
      </div>
      {initialPagination &&
        (
          <div className={clsx(
            'flex space-x-2 justify-center items-center',
          )}>
            <Button
              icon={<AiOutlineBackward size={12} color="white" />}
              onClick={() => setPagination({ ...pagination, page: 0 })}
              className={clsx(
                'rounded-2xl !bg-luka-200 !m-0',
              )}
            />
            <Button
              disabled={pagination.page === 0}
              icon={<AiOutlineArrowLeft size={12} color="white" />}
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              className={clsx(
                'rounded-2xl',
                {
                  '!bg-gray-500': pagination.page === 0,
                  '!bg-luka-200': pagination.page !== 0,
                }
              )}
            />
            <Text size="sm">
              {pagination.page + 1} of {pagination.totalPages}
            </Text>
            <Button
              disabled={pagination.page === pagination.totalPages - 1}
              icon={<AiOutlineArrowRight size={12} color="white" />}
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              className={clsx(
                'rounded-2xl',
                {
                  '!bg-gray-500': pagination.page === pagination.totalPages - 1,
                  '!bg-luka-200': pagination.page !== pagination.totalPages - 1,
                }
              )}
            />
            <Button
              icon={<AiOutlineForward size={12} color="white" />}
              onClick={() => setPagination({ ...pagination, page: pagination.totalPages - 1 })}
              className={clsx(
                'rounded-2xl !bg-luka-200',
              )}
            />
          </div>
        )
      }
    </div>
  )
}

export const asTable = <T,>(): {
  Table: React.FC<TableBodyProps<T>>,
  Attribute: React.FC<TableAttributeProps<T>>,
} => {
  return {
    Table: (props: TableBodyProps<T>) => <TableBody<T> {...props} />,
    Attribute: (props: TableAttributeProps<T>) => <TableAttribute<T> {...props} />,
  }
}
