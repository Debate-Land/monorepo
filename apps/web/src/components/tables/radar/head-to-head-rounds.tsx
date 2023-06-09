import React, { useEffect, useMemo, useState } from 'react'
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
  teamNo: 1 | 2;
  data?: HeadToHeadRound[];
  code?: string;
  isFavorite?: boolean;
  matchupWinPct?: number;
  clutchFactor?: number | '--';
  numRounds?: number;
}

const HeadToHeadRoundsTable = ({ teamNo, data, code, isFavorite, matchupWinPct, clutchFactor, numRounds }: RoundSpeakingResultProps) => {
  const column = createColumnHelper<HeadToHeadRound>()
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });
  const [teamOutcome, setTeamOutcome] = useState<"Wins" | "Losses">(isFavorite ? "Losses" : "Wins");
  const outcome = useMemo(() => teamOutcome === "Wins" ? "Win" : "Loss", [teamOutcome]);
  const filteredRounds = useMemo(() =>
    data?.filter(r => r.outcome === outcome).slice(pagination.pageIndex * pagination.pageSize, (pagination.pageIndex + 1) * pagination.pageSize),
  [outcome, data, pagination]);
  const totalPages = useMemo(() => Math.floor((data?.filter(r => r.outcome && teamOutcome).length || 0) / pagination.pageSize), [data, teamOutcome, pagination.pageSize]);

  return (
    <div className="flex flex-col w-full space-y-2">
      <div className="border-b border-dashed border-gray-400 dark:border-gray-200/40 pb-4 mb-2">
        <h3 className={clsx('text-lg', { 'text-sky-400': teamNo === 1, 'text-violet-400': teamNo === 2 })}>{code} ({isFavorite ? "Favorite" : "Underdog"})</h3>
        <p className="text-sm">Based on {numRounds || '--'} rounds, {code} has a clutch factor of {
          clutchFactor !== undefined
            ? clutchFactor === "--"
              ? clutchFactor
              : Math.round(clutchFactor * 10) / 10
            : '--'
        }.</p>
      </div>
      <div className="w-full justify-between flex">
        <p className="text-sm">{teamOutcome === "Wins" ? "Winning" : "Losing"} rounds with {isFavorite ? `≥ ${matchupWinPct}%` : `≤ ${matchupWinPct}%`} expected win probability.</p>
        <Button
          icon={<HiOutlineSwitchHorizontal className='mr-2' />}
          onClick={() => setTeamOutcome(teamOutcome === "Wins" ? "Losses" : "Wins")}
          className='h-7 !mr-0 !bg-transparent !text-black dark:!text-white hover:opacity-70 active:opacity-90 w-36'
          ghost
        >
          <p className='w-full text-start'>{teamOutcome}</p>
        </Button>
      </div>
      {
        filteredRounds === undefined || filteredRounds.length
          ? (
            <Table
              data={filteredRounds}
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
          )
          : (
            <p className="text-sm text-red-400 text-center max-w-[500px] mx-auto">
              {code} has had no rounds as a{isFavorite ? ' favorite' : 'n underdog'} (with an expected win probability of {isFavorite ? 'as much or higher' : 'as little or less'} than in this matchup) where they've {teamOutcome === "Wins" ? "won" : "lost"}.
            </p>
          )
      }
    </div>
  )
}

export default HeadToHeadRoundsTable