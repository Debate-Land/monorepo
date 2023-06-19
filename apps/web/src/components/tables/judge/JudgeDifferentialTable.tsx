import React, { useMemo } from 'react'
import { ExpandedJudgeTournamentResult } from './JudgingHistoryTable';
import { ColumnDef, createColumnHelper } from '@tanstack/react-table';
import JudgeRecordsTable, { ExpandedJudgeRecord } from './JudgeRecordsTable';
import { TopicType } from '@shared/database';
import { Card, Table } from '@shared/components';
import { LuCircuitBoard } from 'react-icons/lu';
import getEnumName from '@src/utils/get-enum-name';

interface JudgeDifferentialTableRow {
  topicType: TopicType;
  pctPro: [number, number];
}

interface JudgeDifferentialTableProps {
  data: ExpandedJudgeTournamentResult[];
}

const JudgeDifferentialTable = ({ data }: JudgeDifferentialTableProps) => {
  const column = createColumnHelper<JudgeDifferentialTableRow>();

  const tableData = useMemo(() => {
    let table: JudgeDifferentialTableRow[] = [];
    data.forEach(result => {
      result.tournament.topic?.tags.forEach(tag => {
        const numPro = (result.numAff || 0) + (result.numPro || 0);
        const numCon = (result.numNeg || 0) + (result.numCon || 0);
        if (!table.find(row => row.topicType === tag.tag)) {
          table.push({
            topicType: tag.tag,
            pctPro: [numPro, numCon]
          })
        } else {
          const rowIdx = table.findIndex(row => row.topicType == tag.tag) as number;
          let [initPro, initCon] = table[rowIdx].pctPro as [number, number];
          table[rowIdx].pctPro = [initPro + numPro, initCon + numCon];
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
            column.accessor('pctPro', {
              header: "Pct. Pro/Aff",
              cell: props => {
                const [pro, con] = props.cell.getValue();
                return Math.round(pro / (pro + con) * 100) + '%'
              }
            }),
            column.accessor('pctPro', {
              header: "Num. Rounds",
              cell: props => props.cell.getValue().reduce((a, b) => a + b, 0)
            }),
          ] as ColumnDef<JudgeDifferentialTableRow>[],
        }}
      />
    </Card>
  )
}

export default JudgeDifferentialTable