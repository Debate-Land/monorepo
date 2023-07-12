import React, { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "@src/utils/trpc";
import { TournamentHistoryTable } from "@src/components/tables/team";
import { NextSeo } from "next-seo";
import Overview from "@src/components/layout/Overview";
import Statistics from "@src/components/layout/Statistics";
import getEnumName from "@src/utils/get-enum-name";
import { appRouter } from "../../server/routers/_app";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { prisma } from "@shared/database";
import { omit } from "lodash";
import TeamCharts from "@src/components/charts/TeamCharts";
import TeamInfoTable from "@src/components/tables/team/TeamInfoTable";
import TeamDifferentialTable from "@src/components/tables/team/TeamDifferentialTable";
import CommandBar from "@src/components/features/CommandBar";
import { BiLinkExternal } from "react-icons/bi";
import { Card, Loader } from "@shared/components";
import { HiOutlineLightBulb } from "react-icons/hi";
import getStringFromList from "@src/utils/get-string-from-list";

const Team = () => {
  const { query, isReady, asPath, ...router } = useRouter();
  const { data } = trpc.team.summary.useQuery(
    {
      id: query.id as string,
      ...(query.circuit && {
        circuit: parseInt(query.circuit as unknown as string),
      }),
      ...(query.season && {
        season: parseInt(query.season as unknown as string),
      }),
      ...(query.topics && {
        topics: (query.topics as string).split(",").map((t) => parseInt(t)),
      }),
      ...(query.topicTags && {
        topicTags: (query.topicTags as string)
          .split(",")
          .map((t) => parseInt(t)),
      }),
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const SEO_TITLE = `${data?.aliases[0]?.code || "--"}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${
    data?.aliases[0].code || "--"
  }'s competitive statistics for ${
    data ? getEnumName(data.circuits[0].event) : "--"
  }, exclusively on Debate Land.`;

  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: "website",
          url: `https://debate.land${asPath}`,
          images: [
            {
              url: `https://debate.land/api/og?title=${data?.aliases[0].code}&label=Team`,
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        noindex
      />
      <div className="min-h-screen">
        <Overview
          label="Team"
          heading={
            data ? (
              <>
                <button
                  onClick={() =>
                    router.push({
                      pathname: `/competitors/${data.competitors[0].id}`,
                      query: omit(query, "id"),
                    })
                  }
                  className="relative hover:opacity-80 active:opacity-100 mr-3 md:mr-4"
                >
                  <BiLinkExternal className="absolute text-xs p-px md:text-sm md:p-0 top-1 -right-3 md:-right-4" />
                  {data.competitors[0].name}
                </button>
                {data.competitors.length > 1 && (
                  <span>
                    {" & "}
                    <button
                      onClick={() =>
                        router.push({
                          pathname: `/competitors/${data.competitors[1].id}`,
                          query: omit(query, "id"),
                        })
                      }
                      className="relative hover:opacity-80 active:opacity-100 mr-3 md:mr-4"
                    >
                      <BiLinkExternal className="absolute text-xs p-px md:text-sm md:p-0 top-1 -right-3 md:-right-4" />
                      {data.competitors[1].name}
                    </button>
                  </span>
                )}
              </>
            ) : undefined
          }
          subtitle={
            data ? (
              <CommandBar
                topics={data ? data.filterData : []}
                subscriptionName={data?.aliases[0].code || ""}
                emailProps={{
                  teamId: data?.id,
                }}
              >
                {getEnumName(data.circuits[0].event)} | {data.circuits[0].name}{" "}
                | {data.seasons[0].id.toString()}
              </CommandBar>
            ) : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? "#" + data.ranking.circuitRank : undefined,
                  description: "Team Rank",
                },
                {
                  value: data
                    ? Math.round(data.statistics.otr * 100) / 100
                    : undefined,
                  description: "OTR Score",
                },
                {
                  value: data ? data.statistics.bids || "--" : undefined,
                  description: `TOC Bid${
                    (data?.statistics.bids || 2) > 1 ? "s" : ""
                  }`,
                },
                {
                  value: data
                    ? data.statistics.avgSpeaks
                      ? Math.round(data.statistics.avgSpeaks * 10) / 10
                      : "--"
                    : undefined,
                  description: "Avg Raw Spks.",
                },
              ]}
              advanced={[
                {
                  value: data?.results.length,
                  description: "Tournaments",
                },
                {
                  value: data
                    ? data.statistics.stdDevSpeaks
                      ? Math.round(data.statistics.stdDevSpeaks * 100) / 100
                      : "--"
                    : undefined,
                  description: "Avg. σ Speaks",
                },
                {
                  value: data?.statistics.lastActive,
                  description: "Last Active",
                },
                {
                  value: data ? data.statistics.inTop20Pct + "x" : undefined,
                  description: "Top 20% Seed",
                },
                {
                  value: data?.statistics.avgOpWpM,
                  isPercentage: true,
                  round: 1,
                  description: "Avg. OpWpM",
                },
                {
                  value: data?.statistics.pWp,
                  isPercentage: true,
                  round: 1,
                  description: "Prelim Win Pct.",
                },
                {
                  value: data ? data.statistics.breakPct || "--" : undefined,
                  isPercentage: true,
                  round: 1,
                  description: "Break Pct.",
                },
                {
                  value: data?.statistics.tWp,
                  isPercentage: true,
                  round: 1,
                  description: "True Win Pct.",
                },
              ]}
            />
          }
          subheading={data?.aliases[0]?.code}
        />
        <Card
          icon={<HiOutlineLightBulb />}
          title="Summary"
          className="relative max-w-[800px] mx-auto my-16 grid place-items-start"
        >
          <p className="flex flex-wrap space-x-1">
            {data?.aliases[0]?.code || <Loader width={22} height={6} />} is the{" "}
            {data ? (
              "#" + data.ranking.circuitRank
            ) : (
              <Loader width={8} height={6} />
            )}{" "}
            team on the{" "}
            {data?.circuits[0]?.name.toLowerCase() || (
              <Loader width={14} height={6} />
            )}{" "}
            circuit for{" "}
            {data ? (
              getEnumName(data.circuits[0]?.event)
            ) : (
              <Loader width={14} height={6} />
            )}{" "}
            debate. They have{" "}
            {data?.statistics.bids || <Loader width={8} height={6} />} bid
            {(data?.statistics.bids || 0) > 1 ? "s" : ""} across{" "}
            {data?.results.length || <Loader width={8} height={6} />} tournament
            {(data?.results.length || 1) > 1 ? "s" : ""}, averaging{" "}
            {data?.statistics.avgSpeaks.toFixed(1) || (
              <Loader width={8} height={6} />
            )}{" "}
            speaker points with a true win percentage of{" "}
            {data ? (
              (data.statistics.tWp * 100).toFixed(1) + "%"
            ) : (
              <Loader width={8} height={6} />
            )}
            . Here are their results and statiscs for{" "}
            {data ? (
              data.filter.topics.length ? (
                `the following topics: ${getStringFromList(
                  data.filter.topics.map((t) => t.nickname)
                )}`
              ) : (
                "all topics"
              )
            ) : (
              <Loader width={8} height={6} />
            )}
            {" and "}
            {data ? (
              data.filter.topicTags.length ? (
                `the following topic types: ${getStringFromList(
                  data.filter.topicTags.map((t) => t.tag)
                )}.`
              ) : (
                "all topic types."
              )
            ) : (
              <Loader width={8} height={6} />
            )}{" "}
          </p>
        </Card>
        <TournamentHistoryTable data={data?.results} />
        <TeamCharts
          results={
            data?.results.sort(
              (a, b) => a.tournament.start - b.tournament.start
            ) || []
          }
        />
        <TeamDifferentialTable data={data?.results || []} />
        <TeamInfoTable aliases={data?.aliases} schools={data?.schools} />
      </div>
    </>
  );
};

interface TeamParams extends ParsedUrlQuery {
  id: string;
  circuit?: string;
  season?: string;
  topics?: string;
  topicTags?: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
    },
  });

  const { id, circuit, season, topics, topicTags } = ctx.query as TeamParams;

  await ssg.team.summary.prefetch({
    id,
    ...(circuit && { circuit: parseInt(circuit) }),
    ...(season && { season: parseInt(season) }),
    ...(topics && { topics: topics?.split(",").map((t) => parseInt(t)) }),
    ...(topicTags && {
      topicTags: topicTags?.split(",").map((t) => parseInt(t)),
    }),
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default Team;
