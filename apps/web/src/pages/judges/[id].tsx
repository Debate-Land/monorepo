import React, {useEffect} from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import _ from 'lodash';
import { JudgingHistoryTable } from '@src/components/tables/judge';
import getEnumName from '@src/utils/get-enum-name';
import { ParsedUrlQuery } from 'querystring';
import { prisma } from '@shared/database';
import { appRouter } from '@src/server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import JudgeCharts from '@src/components/charts/JudgeCharts';


const Judge = () => {
  const { query, isReady, asPath } = useRouter();
  const { data } = trpc.judge.summary.useQuery(
    {
      id: query.id as string,
      ...(query.circuit && {
        circuit: parseInt(query.circuit as unknown as string)
      }),
      ...(query.season && {
        season: parseInt(query.season as unknown as string)
      })
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const avgSpeaks = (data
    ? (_.mean(
      data.results
        .filter(r => r.avgRawPoints)
        .map(r => r.avgRawPoints) || [0]
    )).toFixed(1)
    : NaN) as number;

  const avgSpeakStdDev = (data
    ? (_.mean(
      data.results
        .filter(r => r.stdDevPoints)
        .map(r => r.stdDevPoints) || [0]
    )).toFixed(1)
    : NaN) as number;

  const SEO_TITLE = `${data?.name || '--'}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${data?.name || '--'}'s judge statistics for ${getEnumName(data?.rankings[0].circuit.event)}, exclusively on Debate Land.`;

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
            url: `https://debate.land/api/og?title=${data?.name}&label=Judge`
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
          label="Judge"
          heading={
            data
              ? data.name
              : undefined
          }
          subtitle={
            data
              ? `${getEnumName(data.rankings[0].circuit.event)} | ${data.rankings[0].circuit.name} | ${query.season || "All Seasons"}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? data.index?.toFixed(1) : undefined,
                  description: "Judge Index"
                },
                {
                  value: data ? data.results?.length : undefined,
                  description: "Tournaments"
                },
                {
                  value: !isNaN(avgSpeaks) ? avgSpeaks : '--',
                  description: "Avg. Speaks"
                },
                {
                  value: !isNaN(avgSpeakStdDev) ? avgSpeakStdDev : '--',
                  description: "Avg. σ Speaks",
                }
              ]}
            />
          }
        />
        <JudgingHistoryTable data={data?.results} />
        <JudgeCharts results={data?.results} />
      </div>
    </>
  )
}

interface JudgeParams extends ParsedUrlQuery {
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
      prisma
    },
  });

  const { id, circuit, season, topics, topicTags } = ctx.query as JudgeParams;

  await ssg.judge.summary.prefetch({
    id,
    ...(circuit && { circuit: parseInt(circuit) }),
    ...(season && { season: parseInt(season) }),
    ...(topics && { topics: topics?.split(',').map(t => parseInt(t)) }),
    ...(topicTags && { topicTags: topicTags?.split(',').map(t => parseInt(t)) })
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }
  }
}

export default Judge