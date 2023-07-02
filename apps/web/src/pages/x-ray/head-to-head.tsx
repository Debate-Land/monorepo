import { CustomTick } from "@shared/components";
import { PercentageTick } from "@shared/components";
import { Button, Card } from "@shared/components";
import { Event, prisma } from "@shared/database";
import Overview from "@src/components/layout/Overview";
import Statistics from "@src/components/layout/Statistics";
import HeadToHeadRoundsTable from "@src/components/tables/radar/HeadToHeadRoundTable";
import PreviousHistory from "@src/components/tables/radar/PreviousHistoryTable";
import { appRouter } from "@src/server/routers/_app";
import getClutchFactor, {
  getClutchFactorFromRoundHistory,
} from "@src/utils/get-clutch-factor";
import getEnumName from "@src/utils/get-enum-name";
import getExpectedWP from "@src/utils/get-expected-wp";
import { trpc } from "@src/utils/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React, { useEffect, useMemo, useState } from "react";
import { BiLinkExternal } from "react-icons/bi";
import { BsLightbulb } from "react-icons/bs";
import { GiAtomicSlashes } from "react-icons/gi";
import { Bar, BarChart, Cell, LabelList, XAxis, YAxis } from "recharts";

interface HeadToHeadParams extends ParsedUrlQuery {
  event: string;
  circuit: string;
  season: string;
  team1: string;
  team2: string;
}

const boundWp = (wp: number) => {
  if (wp > 99) return 99;
  else if (wp < 1) return 1;
  return Math.floor(wp * 10) / 10;
};

const truncateTeamCode = (code: string) => {
  let truncated = "";
  const nodes = code.split(" ");
  for (let i = nodes.length - 1; i >= 0; i--) {
    if ((truncated + nodes[i]).length < 10) {
      truncated = nodes[i] + " " + truncated;
    } else return truncated.trim();
  }
  return truncated;
};

const HeadToHead = () => {
  const { query, isReady, asPath, push } = useRouter();
  const { theme } = useTheme();
  const { data } = trpc.feature.headToHead.useQuery(
    {
      event: query.event as string,
      circuit: parseInt(query.circuit as string),
      season: parseInt(query.season as string),
      team1: query.team1 as string,
      team2: query.team2 as string,
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const { team1Code, team2Code, team1Otr, team2Otr } = useMemo(
    () => ({
      team1Code: data?.team1.ranking.team.aliases[0].code,
      team2Code: data?.team2.ranking.team.aliases[0].code,
      team1Otr: data?.team1.ranking.otr,
      team2Otr: data?.team2.ranking.otr,
    }),
    [data]
  );
  const isTeam1Favorite = useMemo(() => {
    if (data?.team1.ranking.otr && data?.team2.ranking.otr) {
      if (data.team1.ranking.otr > data.team2.ranking.otr) {
        return true;
      } else {
        return false;
      }
    }
    return undefined;
  }, [data]);
  const team1Wp = useMemo(
    () =>
      team1Otr && team2Otr
        ? boundWp(
            team1Otr > team2Otr
              ? 100 * getExpectedWP(team1Otr, team2Otr)
              : 100 - 100 * getExpectedWP(team1Otr, team2Otr)
          )
        : undefined,
    [team1Otr, team2Otr]
  );
  const team2Wp = useMemo(
    () =>
      team1Otr && team2Otr
        ? boundWp(
            team1Otr > team2Otr
              ? 100 - 100 * getExpectedWP(team1Otr, team2Otr)
              : 100 * getExpectedWP(team1Otr, team2Otr)
          )
        : undefined,
    [team1Otr, team2Otr]
  );
  const chartData = useMemo(
    () =>
      data &&
      team1Otr &&
      team2Otr && [
        {
          label: team1Code && truncateTeamCode(team1Code),
          pct: team1Wp,
        },
        {
          label: team2Code && truncateTeamCode(team2Code),
          pct: team2Wp,
        },
      ],
    [data, team1Code, team1Otr, team2Code, team2Otr, team1Wp, team2Wp]
  );
  const team1ClutchFactor = useMemo(() => {
    return data
      ? getClutchFactorFromRoundHistory(
          data.team1.ranking.otr as number,
          data.team1.history
        )
      : "--";
  }, [data]);
  const team2ClutchFactor = useMemo(() => {
    return data
      ? getClutchFactorFromRoundHistory(
          data.team2.ranking.otr as number,
          data.team2.history
        )
      : "--";
  }, [data]);

  const SEO_TITLE = `Round Prediction: ${team1Code} vs ${team2Code}`;
  const SEO_DESCRIPTION = `Our prediction of the winning team in a round between ${team1Code} and ${team2Code}, exclusively on Debate Land.`;

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
              url: `https://debate.land/api/og?title=${team1Code} vs ${team2Code}&label=Prediction`,
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
          label="Prediction"
          heading={
            data ? (
              <span className="leading-6">
                <button
                  className="relative hover:opacity-80 active:opacity-100 mr-3 md:mr-4"
                  onClick={() =>
                    push({
                      pathname: `/teams/${query.team1}`,
                      query: {
                        circuit: query.circuit,
                        season: query.season,
                      },
                    })
                  }
                >
                  <BiLinkExternal className="absolute text-xs p-px md:text-sm md:p-0 top-1 -right-3 md:-right-4" />
                  {team1Code}
                </button>
                {" vs "}
                <button
                  className="relative hover:opacity-80 active:opacity-100 mr-3 md:mr-4"
                  onClick={() =>
                    push({
                      pathname: `/teams/${query.team2}`,
                      query: {
                        circuit: query.circuit,
                        season: query.season,
                      },
                    })
                  }
                >
                  <BiLinkExternal className="absolute text-xs p-px md:text-sm md:p-0 top-1 -right-3 md:-right-4" />
                  {team2Code}
                </button>
              </span>
            ) : undefined
          }
          subtitle={
            isReady
              ? `${query.season} ${getEnumName(query.event as Event)}`
              : undefined
          }
          underview={<></>}
        />
        <Card
          icon={<BsLightbulb />}
          title="Prediction"
          className="max-w-[800px] mx-auto my-16"
        >
          <div className="flex justify-center w-full">
            <BarChart width={300} height={200} data={chartData || []}>
              <XAxis dataKey="label" />
              <YAxis tick={PercentageTick} ticks={[0, 25, 50, 75, 100]} />
              <Bar
                dataKey="pct"
                fill="#8884d8"
                opacity={theme === "dark" ? 1 : 0.75}
                radius={5}
              >
                <LabelList
                  dataKey="pct"
                  formatter={(v: number) => Math.floor(v * 10) / 10 + "%"}
                  position="insideBottom"
                  angle={0}
                  offset={5}
                  fill={theme === "dark" ? "white" : "black"}
                  fontWeight="bold"
                />
                <Cell fill="rgb(56 189 248)" />
                <Cell fill="rgb(167 139 250)" />
              </Bar>
            </BarChart>
          </div>
          <div className="w-full text-center">
            <p>
              In a matchup between{" "}
              <span className="text-sky-400">{team1Code}</span> and{" "}
              <span className="text-violet-400">{team2Code}</span>, our model
              trained on over 100,000 rounds expects{" "}
              {team1Otr && team2Otr ? (
                team1Otr > team2Otr ? (
                  <span className="text-sky-400">{team1Code}</span>
                ) : (
                  <span className="text-violet-400">{team2Code}</span>
                )
              ) : (
                "--"
              )}{" "}
              to be the favorite, with an expected win probability of{" "}
              {team1Otr && team2Otr ? (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">
                  {Math.floor(
                    boundWp(getExpectedWP(team1Otr, team2Otr) * 100) * 10
                  ) / 10}
                  %
                </span>
              ) : (
                "--"
              )}
              .
            </p>
          </div>
        </Card>
        <PreviousHistory
          // @ts-ignore
          data={data?.matchupHistory}
          team1Code={team1Code}
          team2Code={team2Code}
        />
        <Card
          icon={<GiAtomicSlashes />}
          title="Clutch Factor"
          className="max-w-[800px] mx-auto my-16"
        >
          <HeadToHeadRoundsTable
            teamNo={1}
            data={data?.team1.rounds}
            code={team1Code}
            isFavorite={isTeam1Favorite}
            clutchFactor={team1ClutchFactor}
            matchupWinPct={team1Wp}
            numRounds={data?.team1.history.length}
          />
          <HeadToHeadRoundsTable
            teamNo={2}
            data={data?.team2.rounds}
            code={team2Code}
            isFavorite={!isTeam1Favorite}
            clutchFactor={team2ClutchFactor}
            matchupWinPct={team2Wp}
            numRounds={data?.team2.history.length}
          />
        </Card>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
    },
  });

  const { event, circuit, season, team1, team2 } =
    ctx.query as HeadToHeadParams;

  await ssg.feature.headToHead.prefetch({
    event: event as string,
    circuit: parseInt(circuit as string),
    season: parseInt(season as string),
    team1: team1 as string,
    team2: team2 as string,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default HeadToHead;
