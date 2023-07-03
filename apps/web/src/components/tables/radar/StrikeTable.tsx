import { Card, Table, Text } from "@shared/components";
import {
  Bid,
  Judge,
  JudgeRanking,
  JudgeTournamentResult,
  Team,
  TeamRanking,
  TeamTournamentResult,
  TournamentSpeakerResult,
} from "@shared/database";
import {
  ColumnDef,
  PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import React, { useState } from "react";
import _ from "lodash";
import { IoMdCloseCircleOutline } from "react-icons/io";

interface ExpandedJudge extends Judge {
  results: (JudgeTournamentResult & {
    // speaking: TournamentSpeakerResult[] | null;
    // bid: Bid | null
  })[];
  rank: (JudgeRanking & { circuitRank: number }) | null;
}

interface UnknownJudge {
  name: string;
}

interface StrikeTableProps {
  data: ExpandedJudge[];
}

const StrikeTable = ({ data }: StrikeTableProps) => {
  const knownJudgeColumn = createColumnHelper<ExpandedJudge>();
  const unknownJudgeColumn = createColumnHelper<UnknownJudge>();
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  });

  return (
    <Card
      icon={<IoMdCloseCircleOutline />}
      title="Strike Sheet"
      className="max-w-[800px] mx-auto my-16"
    >
      <Text>Known Judges</Text>
      {data.filter((d) => !!d.id).length ? (
        <Table
          data={data
            .filter((d) => !!d.id)
            .slice(
              pagination.pageIndex * pagination.pageSize,
              (pagination.pageIndex + 1) * pagination.pageSize
            )}
          columnConfig={{
            core: [
              knownJudgeColumn.accessor("name", {
                header: "Judge",
                cell: (props) => props.cell.getValue(),
              }),
              knownJudgeColumn.accessor("rank", {
                header: "Rank",
                cell: (props) => props.cell.getValue()?.circuitRank || "--",
              }),
              knownJudgeColumn.accessor("rank", {
                header: "Index",
                cell: (props) =>
                  props.cell.getValue()?.index.toFixed(1) || "--",
              }),
            ] as ColumnDef<ExpandedJudge>[],
            lg: [
              knownJudgeColumn.accessor("results", {
                header: "# Tourns.",
                cell: (props) => props.cell.getValue().length,
              }),
              knownJudgeColumn.accessor("results", {
                header: "Pro/Aff %",
                cell: (props) => {
                  const results = props.cell.getValue();
                  let pro = 0;
                  let con = 0;
                  results.forEach((result) => {
                    pro += (result.numAff || 0) + (result.numPro || 0);
                    con += (result.numNeg || 0) + (result.numCon || 0);
                  });

                  return Math.floor((pro / (pro + con)) * 1000) / 10 + "%";
                },
              }),
              knownJudgeColumn.accessor("results", {
                header: "Avg. Spks.",
                cell: (props) => {
                  const results = props.cell.getValue();
                  let speaks: number[] = [];
                  results.forEach((result) => {
                    result.avgRawPoints && speaks.push(result.avgRawPoints);
                  });
                  return speaks.length
                    ? (
                        speaks.reduce((a, b) => a + b, 0) / speaks.length
                      ).toFixed(1)
                    : "--";
                },
              }),
            ] as ColumnDef<ExpandedJudge>[],
          }}
          paginationConfig={{
            pagination,
            setPagination,
            totalPages: Math.ceil(
              data.filter((d) => !!d.id).length / pagination.pageSize
            ),
          }}
          sortable
          showPosition
        />
      ) : (
        <div className="w-full flex justify-center p-3">
          <Text>No known judges!</Text>
        </div>
      )}

      <Text>Unknown Judges</Text>
      {data.filter((d) => !d.id).length ? (
        <Table
          data={data.filter((d) => !d.id)}
          columnConfig={{
            core: [
              unknownJudgeColumn.accessor("name", {
                header: "Judge",
                cell: (props) => props.cell.getValue(),
              }),
            ] as ColumnDef<UnknownJudge>[],
          }}
        />
      ) : (
        <div className="w-full flex justify-center p-3">
          <Text>No unknown judges!</Text>
        </div>
      )}
    </Card>
  );
};

export default StrikeTable;
