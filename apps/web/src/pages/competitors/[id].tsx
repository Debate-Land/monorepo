import React, {useEffect, useMemo} from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import _ from 'lodash';
import { ParsedUrlQuery } from 'querystring';
import { prisma } from '@shared/database';
import { appRouter } from '@src/server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import CompetitorHistoryTable from '@src/components/tables/competitor/CompetitorHistoryTable';
import getEnumName from '@src/utils/get-enum-name';


const Competitor = () => {
  const { query, isReady, asPath } = useRouter();
  const { data } = trpc.competitor.summary.useQuery(
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

  const speaks = useMemo(() => (
    data
      ? data.roundSpeakerResults
        .filter(r => r.points)
        .map(r => r.points)
      : null
  ), [data]);

  const SEO_TITLE = `${data?.name || '--'}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${data?.name || '--'}'s competitor statistics, exclusively on Debate Land.`;

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
          label="Competitor"
          heading={
            data
              ? data.name
              : undefined
          }
          subtitle={
            data
              ? `${getEnumName(data.teams[0].circuits[0].event)} | ${data.teams[0].circuits[0].name} | ${query.season}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? data.teams.length : undefined,
                  description: "Teams"
                },
                {
                  value: data ? data.teams.map(t => t._count.results).reduce((a, b) => a + b) : undefined,
                  description: "Tournaments"
                },
                {
                  value: speaks?.length ? Math.round(_.mean(speaks) * 10) / 10 : '--',
                  description: "Avg. Speaks"
                },
                {
                  value: speaks?.length
                    ? Math.round(Math.pow(_.sum(speaks.map(s => Math.pow(s - _.mean(speaks), 2))) / speaks.length, 2) * 100) / 100
                    : '--',
                  description: "σ Speaks",
                }
              ]}
            />
          }
        />
        <CompetitorHistoryTable data={data?.teams} />
      </div>
    </>
  )
}

interface CompetitorParams extends ParsedUrlQuery {
  id: string;
  circuit: string;
  season: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {

  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma
    },
  });

  const { id, circuit, season } = ctx.query as CompetitorParams;

  await ssg.competitor.summary.prefetch({
    id,
    circuit: parseInt(circuit),
    season: parseInt(season)
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }
  }
}

export default Competitor