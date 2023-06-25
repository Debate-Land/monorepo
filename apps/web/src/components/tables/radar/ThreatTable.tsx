import { Card, Table, Text } from "@shared/components";
import {
  Bid,
  Team,
  TeamRanking,
  TeamTournamentResult,
  TournamentSpeakerResult,
} from "@shared/database";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import { FaCrosshairs } from "react-icons/fa";
import _ from "lodash";

interface ExpandedTeam extends Team {
  code: string;
  results: (TeamTournamentResult & {
    speaking: TournamentSpeakerResult[] | null;
    bid: Bid | null;
  })[];
  rankings: (TeamRanking & {
    circuit: {
      name: string;
    };
  })[];
}

interface UnknownTeam {
  code: string;
}

interface ThreatTableProps {
  data: ExpandedTeam[];
}

const ThreatTable = ({ data }: ThreatTableProps) => {
  const knownTeamColumn = createColumnHelper<ExpandedTeam>();
  const unknownTeamColumn = createColumnHelper<UnknownTeam>();

  return (
    <Card
      icon={<FaCrosshairs />}
      title="Threat Sheet"
      className="max-w-[800px] mx-auto my-16"
    >
      <Text>Known Entries</Text>
      {data.filter((d) => !!d.id).length ? (
        <Table
          data={data.filter((d) => !!d.id)}
          columnConfig={{
            core: [
              knownTeamColumn.accessor("code", {
                header: "Team",
                cell: (props) => props.cell.getValue(),
              }),
              knownTeamColumn.accessor("rankings", {
                header: "OTR",
                cell: (props) => props.cell.getValue()[0].otr.toFixed(1),
              }),
              knownTeamColumn.accessor("results", {
                header: "# Tourns.",
                cell: (props) => props.cell.getValue().length,
              }),
            ] as ColumnDef<ExpandedTeam>[],
            lg: [
              knownTeamColumn.accessor("results", {
                header: "Prelim Win %",
                cell: (props) => {
                  const results = props.cell.getValue();
                  let wins = 0;
                  let losses = 0;
                  results.forEach((result) => {
                    wins += result.prelimWins;
                    losses += result.prelimLosses;
                  });

                  return Math.floor((wins / (wins + losses)) * 1000) / 10 + "%";
                },
              }),
              knownTeamColumn.accessor("results", {
                header: "Avg. Spks.",
                cell: (props) => {
                  const results = props.cell.getValue();
                  let speaks: number[] = [];
                  results.forEach((result) => {
                    result.speaking?.forEach((speak) => {
                      speaks.push(speak.rawAvgPoints);
                    });
                  });
                  return speaks.length
                    ? (
                        speaks.reduce((a, b) => a + b, 0) / speaks.length
                      ).toFixed(1)
                    : "--";
                },
              }),
              knownTeamColumn.accessor("results", {
                header: "Bids",
                cell: (props) => {
                  const results = props.cell.getValue();
                  let bids = 0;
                  results.forEach((result) => {
                    if (result.bid) {
                      bids += result.bid.value === "Full" ? 1 : 0.5;
                    }
                  });
                  return bids;
                },
              }),
            ] as ColumnDef<ExpandedTeam>[],
          }}
          sortable
          showPosition
        />
      ) : (
        <div className="w-full flex justify-center p-3">
          <Text>No known entries!</Text>
        </div>
      )}
      <Text>Unknown Entries</Text>
      {data.filter((d) => !d.id).length ? (
        <Table
          data={data.filter((d) => !d.id)}
          columnConfig={{
            core: [
              unknownTeamColumn.accessor("code", {
                header: "Team",
                cell: (props) => props.cell.getValue(),
              }),
            ] as ColumnDef<UnknownTeam>[],
          }}
        />
      ) : (
        <div className="w-full flex justify-center p-3">
          <Text>No unknown entries!</Text>
        </div>
      )}
    </Card>
  );
};

export default ThreatTable;
