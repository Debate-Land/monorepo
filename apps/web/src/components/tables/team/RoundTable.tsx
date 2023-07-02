import React from "react";
import { Table, Text } from "@shared/components";
import {
  ExpandedRound,
  ExpandedRoundJudgeRecord,
  ExpandedTournamentResult,
} from "./TournamentHistoryTable";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import RoundSpeakingResultTable from "./RoundSpeakingResultTable";
import { useRouter } from "next/router";
import omit from "lodash/omit";
import Link from "next/link";

export interface RoundTableProps {
  row: ExpandedRound;
  result: ExpandedTournamentResult;
}

const RoundTable = ({
  row: { records: judgeRecords, speaking, ...round },
  result,
}: RoundTableProps) => {
  const { query, ...router } = useRouter();
  const column = createColumnHelper<ExpandedRoundJudgeRecord>();

  return judgeRecords.length ? (
    <>
      <Table
        data={judgeRecords}
        columnConfig={{
          core: [
            column.accessor("judge", {
              header: "Judge",
              cell: (props) => props.cell.getValue().name,
              enableSorting: false,
            }),
            column.accessor("decision", {
              header: "Dec.",
              cell: (props) =>
                `${props.cell.getValue()} (${
                  props.cell.getValue() === round.side ? "W" : "L"
                })`,
            }),
          ] as ColumnDef<ExpandedRoundJudgeRecord>[],
          lg: [
            column.display({
              header: "Spk.",
              cell: (props) => {
                let speakingResults = speaking.filter(
                  (result) => result.judgeId === props.row.original.judge.id
                );
                return speakingResults.length ? (
                  <RoundSpeakingResultTable data={speakingResults} />
                ) : (
                  <>--</>
                );
              },
            }),
          ] as ColumnDef<ExpandedRoundJudgeRecord>[],
        }}
        onRowClick={(row) =>
          router.push({
            pathname: `/judges/${row.judge.id}`,
            query: omit(query, ["id", "topics", "topicTags"]),
          })
        }
        sortable
      />
      <div className="w-full flex justify-center p-3">
        <Text>
          Want more? See our{" "}
          <Link
            href={{
              pathname: "/x-ray/head-to-head",
              query: {
                circuit: result.tournament.circuits[0].id,
                event: result.tournament.circuits[0].event,
                season: result.tournament.seasonId,
                team1: result.teamId,
                team2: round.opponentId,
                judges: judgeRecords.map((r) => r.judge.id).join(","),
              },
            }}
            className="text-blue-400 underline hover:opacity-80 active:opacity-100"
          >
            round prediction
          </Link>
          .
        </Text>
      </div>
    </>
  ) : (
    <div className="w-full flex justify-center p-3">
      <Text>No judging details for {round.nameStd}!</Text>
    </div>
  );
};

export default RoundTable;
