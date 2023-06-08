import React, { useMemo, useState } from 'react'
import { Button, Table, Text } from '@shared/components'
import { ColumnDef, PaginationState, createColumnHelper } from '@tanstack/react-table'
import { RoundOutcome } from '@shared/database';
import getExpectedWP from '@src/utils/get-expected-wp';
import clsx from 'clsx';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

export interface HeadToHeadRound {
  opponent: {
    code: string;
  };
  name: string;
  outcome: RoundOutcome;
  opponentOtr: number;
  otr: number;
}

export interface RoundSpeakingResultProps {
  data?: HeadToHeadRound[];
  code?: string;
  isFavorite?: boolean;
}

const HeadToHeadRoundsTable = ({ data, code, isFavorite }: RoundSpeakingResultProps) => {
  const column = createColumnHelper<HeadToHeadRound>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [teamOutcome, setTeamOutcome] = useState<"Wins" | "Losses">(!isFavorite ? "Losses" : "Wins");
  const outcome = useMemo(() => teamOutcome === "Wins" ? "Win" : "Loss", [teamOutcome]);
  const totalPages = useMemo(() => Math.floor((data?.filter(r => r.outcome && outcome).length || 0)/pagination.pageSize), [data, outcome, pagination.pageSize]);

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="w-full justify-between flex">
        <p>{code} ({isFavorite ? "Favorite" : "Underdog"})</p>
        <Button
          icon={<HiOutlineSwitchHorizontal className='mr-2' />}
          onClick={() => setTeamOutcome(teamOutcome === "Wins" ? "Losses" : "Wins")}
          className='h-7 !mr-0 !bg-transparent !text-black dark:!text-white hover:opacity-70 active:opacity-90 w-36'
          ghost
        >
          <p className='w-full text-start'>{teamOutcome}</p>
        </Button>
      </div>
      <Table
        data={data?.filter(r => r.outcome === outcome).slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize)}
        columnConfig={{
          core: [
            column.accessor('name', {
              header: "Tourn.",
              cell: props => props.cell.getValue(),
            }),
            column.accessor('opponent.code', {
              header: "Opp.",
              cell: props => props.cell.getValue()
            }),
            column.display({
              header: 'Win Prob.',
              cell: props => {
                const { otr, opponentOtr } = props.row.original;
                let expHiWinProp = Math.floor(getExpectedWP(otr, opponentOtr) * 1000) / 10;
                if (expHiWinProp >= 99) expHiWinProp = 99;

                return `${otr > opponentOtr ? expHiWinProp : Math.floor((100 - expHiWinProp) * 10) / 10}%`;
              }
            }),
          ] as ColumnDef<HeadToHeadRound>[],
          sm: [
            column.accessor('outcome', {
              header: "Result",
              cell: props => props.cell.getValue()
            }),
          ] as ColumnDef<HeadToHeadRound>[]
        }}
        numLoadingRows={3}
        paginationConfig={{
          pagination,
          setPagination,
          totalPages: totalPages >= 1 ? totalPages : 1
        }}
      />
    </div>
  )
}

export default HeadToHeadRoundsTable