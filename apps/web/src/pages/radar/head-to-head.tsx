import { CustomTick } from '@shared/components';
import { PercentageTick } from '@shared/components';
import { Button, Card } from '@shared/components';
import { Event, prisma } from '@shared/database';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import HeadToHeadRoundsTable from '@src/components/tables/head-to-head-rounds';
import { appRouter } from '@src/server/routers/_app';
import getEventName from '@src/utils/get-event-name';
import getExpectedWP from '@src/utils/get-expected-wp';
import { trpc } from '@src/utils/trpc';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useMemo, useState } from 'react'
import { BsLightbulb } from 'react-icons/bs';
import { GiAtomicSlashes } from 'react-icons/gi';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';
import { Bar, BarChart, LabelList, Tooltip, XAxis, YAxis } from 'recharts';

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
  return wp;
};

const HeadToHead = () => {
  const { query, isReady, asPath } = useRouter();
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
  const isTeam1Favorite = useMemo(() => {
    if (data?.team1.ranking.otr && data?.team2.ranking.otr) {
      if (data.team1.ranking.otr > data.team2.ranking.otr) {
        return true;
      } else {
        return false;
      }
    }
    return undefined;
  }, [data])

  const team1Code = useMemo(() => data?.team1.ranking.team.aliases[0].code, [data]);
  const team2Code = useMemo(() => data?.team2.ranking.team.aliases[0].code, [data]);
  const team1Otr = useMemo(() => data?.team1.ranking.otr, [data]);
  const team2Otr = useMemo(() => data?.team2.ranking.otr, [data]);

  const chartData = useMemo(() => data && team1Otr && team2Otr && [
    {
      label: team1Code?.split(' ')[0].slice(0, 10),
      pct: boundWp(
        team1Otr > team2Otr ? 100 * getExpectedWP(team1Otr, team2Otr) : 100 - 100 * getExpectedWP(team1Otr, team2Otr)
      )
    },
    {
      label: team2Code?.split(' ')[0].slice(0, 10),
      pct: boundWp(
        team1Otr > team2Otr ? 100 - 100 * getExpectedWP(team1Otr, team2Otr) : 100 * getExpectedWP(team1Otr, team2Otr)
      )
    }
  ], [data, team1Code, team1Otr, team2Code, team2Otr]);

  const SEO_TITLE = `Round Prediction: ${team1Code} vs ${team2Code}`;
  const SEO_DESCRIPTION = `Our prediction of the winning team in a round between ${team1Code} and ${team2Code}, exclusively on Debate Land.`;
  data?.team1.rounds
  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: 'website',
          url: `https://debate.land${asPath}`,
          images: [{
            url: `https://debate.land/api/og?title=${team1Code} vs ${team2Code}&label=Prediction`
          }]
        }}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
        noindex
      />
      <div className="min-h-screen">
        <Overview
          label="Prediction"
          heading={
            data
              ? `${team1Code} vs ${team2Code}`
              : undefined
          }
          subtitle={
            isReady
              ? `${query.season} ${getEventName(query.event as Event)}`
              : undefined
          }
          underview={<></>}
        />
        <Card icon={<BsLightbulb />} title="Prediction" className="max-w-[800px] mx-auto my-16">
          <div className="flex justify-center w-full">
            <BarChart width={300} height={200} data={chartData || []}>
              <XAxis dataKey="label" />
              <YAxis tick={PercentageTick} ticks={[0, 25, 50, 75, 100]} />
              <Bar dataKey="pct" fill="#8884d8" radius={5}>
                <LabelList
                  dataKey="pct"
                  formatter={(v: number) => Math.floor(v * 10) / 10 + '%'}
                  position="insideBottom"
                  angle={0}
                  offset={5}
                  fill='white'
                  fontWeight="bold"
                />
              </Bar>
            </BarChart>
          </div>
          <div className="w-full text-center">
            <p>
              In a matchup between <span className="text-sky-400">{team1Code}</span> and <span className="text-violet-400">{team2Code}</span>, our model trained on over 100,000 rounds expects
              {' '}{team1Otr && team2Otr ? team1Otr > team2Otr ? <span className="text-sky-400">{team1Code}</span> : <span className="text-violet-400">{team2Code}</span> : '--'} to be the favorite,
              {' '}with an expected win probability of {team1Otr && team2Otr ? <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-violet-400">{Math.floor(boundWp(getExpectedWP(team1Otr, team2Otr) * 100) * 10) / 10}%</span> : '--'}.
            </p>
          </div>
        </Card>
        <Card icon={<GiAtomicSlashes />} title="Clutch Factor" className="max-w-[800px] mx-auto my-16">
          <HeadToHeadRoundsTable data={data?.team1.rounds} code={team1Code} isFavorite={isTeam1Favorite} />
          <HeadToHeadRoundsTable data={data?.team2.rounds} code={team2Code} isFavorite={!isTeam1Favorite} />
        </Card>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma
    },
  });

  const { event, circuit, season, team1, team2 } = ctx.query as HeadToHeadParams;

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
    }
  }
}

export default HeadToHead