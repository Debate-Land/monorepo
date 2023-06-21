import React, { useMemo } from 'react'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import { TopicType } from '@shared/database';
import { Card, Table } from '@shared/components';
import { LuCircuitBoard } from 'react-icons/lu';
import getEnumName from '@src/utils/get-enum-name';
import { ExpandedTournamentResult } from './TournamentHistoryTable';

interface TeamDifferentialTableRow {
  topicType: TopicType;
  winPct: [number, number];
}

interface TeamDifferentialTableProps {
  data: ExpandedTournamentResult[];
}

const TeamDifferentialTable = ({ data }: TeamDifferentialTableProps) => {
  const column = createColumnHelper<TeamDifferentialTableRow>();

  const tableData = useMemo(() => {
    let table: TeamDifferentialTableRow[] = [];
    data.forEach(result => {
      const numWins = result.prelimWins + (result.elimWins || 0);
      const numLosses = result.prelimLosses + (result.elimLosses || 0);
      result.tournament.topic?.tags.forEach(tag => {
        if (!table.find(row => row.topicType === tag.tag)) {
          table.push({
            topicType: tag.tag,
            winPct: [numWins, numLosses]
          })
        } else {
          const rowIdx = table.findIndex(row => row.topicType == tag.tag) as number;
          let [initWins, initLosses] = table[rowIdx].winPct as [number, number];
          table[rowIdx].winPct = [initWins + numWins, initLosses + numLosses];
        }
      })
    });
    return table;
  }, [data]);

  return (
    <Card icon={<LuCircuitBoard />} title="Topic Differential" className="max-w-[800px] mx-auto my-16">
      <Table
        data={tableData}
        numLoadingRows={5}
        columnConfig={{
          core: [
            column.accessor('topicType', {
              header: "Topic Type",
              cell: props => getEnumName(props.cell.getValue())
            }),
            column.accessor('winPct', {
              header: "Win Pct.",
              cell: props => {
                const [wins, losses] = props.cell.getValue();
                return Math.round(wins / (wins + losses) * 100) + '%'
              }
            }),
            column.accessor('winPct', {
              header: "Num. Rounds",
              cell: props => props.cell.getValue().reduce((a, b) => a + b, 0)
            }),
          ] as ColumnDef<TeamDifferentialTableRow>[],
        }}
      />
    </Card>
  )
}

export default TeamDifferentialTable