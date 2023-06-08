import React from 'react'
import { Table, Text } from '@shared/components'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { RoundOutcome } from '@shared/database';
import getExpectedWP from '@src/utils/get-expected-wp';
import clsx from 'clsx';

export interface HeadToHeadRound {
  opponent: {
    code: string;
  };
  date: number;
  outcome: RoundOutcome;
  opponentOtr: number;
  otr: number;
}

export interface RoundSpeakingResultProps {
    data?: HeadToHeadRound[]
}

const HeadToHeadRoundsTable = ({ data }: RoundSpeakingResultProps) => {
    const column = createColumnHelper<HeadToHeadRound>()

    return (
        <Table
            data={data}
            columnConfig={{
                core: [
                    column.accessor('opponent.code', {
                        header: "Opp.",
                        cell: props => props.cell.getValue()
                    }),
                    column.accessor('date', {
                        header: "Date",
                        cell: props => new Date(props.cell.getValue() * 1000).toLocaleDateString(),
                    }),
                    column.display({
                      header: 'Win Prob.',
                      cell: props => {
                        const { otr, opponentOtr } = props.row.original;
                        let expHiWinProp = Math.floor(getExpectedWP(otr, opponentOtr) * 1000) / 10;
                        if (expHiWinProp >= 99) expHiWinProp = 99;

                        return `${otr > opponentOtr ? expHiWinProp : 1 - expHiWinProp}%`;
                      }
                    }),
                    column.accessor('outcome', {
                      header: "Result",
                      cell: props => props.cell.getValue()
                  }),
                ] as ColumnDef<HeadToHeadRound>[]
            }}
            numLoadingRows={3}
        />
    )
}

export default HeadToHeadRoundsTable