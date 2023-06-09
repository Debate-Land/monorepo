import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { TournamentHistoryTable } from '@src/components/tables/team'
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import getEventName from '@src/utils/get-event-name';
import { appRouter } from '../../server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { prisma } from '@shared/database';
import TeamCharts from '@src/components/charts/TeamCharts';

// TODO: National Rank at some point...
const Team = () => {
  const { query, isReady, asPath } = useRouter();
  const { data } = trpc.team.summary.useQuery(
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

  const SEO_TITLE = `${data?.aliases[0]?.code || '--'}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${data?.aliases[0].code || '--'}'s competitive statistics for ${getEventName(data?.circuits[0].event)}, exclusively on Debate Land.`;

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
            url: `https://debate.land/api/og?title=${data?.aliases[0].code}&label=Team`
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
          label="Team"
          heading={
            data
              ? (
                <>
                  <a href={`/competitors/${data.competitors[0].id}`}>
                    {data.competitors[0].name}
                  </a>
                  {
                    data.competitors.length > 1 && (
                      <span>
                        {' & '}
                        <a href={`/competitors/${data.competitors[1].id}`}>
                          {data.competitors[1].name}
                        </a>
                      </span>
                    )
                  }
                </>
              )
              : undefined
          }
          subtitle={
            data
              ? `${getEventName(data.circuits[0].event)} | ${data.circuits[0].name} | ${data.seasons[0].id}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? '#' + data.ranking.circuitRank : undefined,
                  description: "Team Rank"
                },
                {
                  value: data ? Math.round(data.statistics.otr * 100) / 100 : undefined,
                  description: "OTR Score"
                },
                {
                  value: data ? data.statistics.bids || '--' : undefined,
                  description: `TOC Bid${(data?.statistics.bids || 2) > 1 ? 's' : ''}`
                },
                {
                  value: data
                    ? data.statistics.avgSpeaks
                      ? Math.round(data.statistics.avgSpeaks * 10) / 10
                      : '--'
                    : undefined,
                  description: "Avg Raw Spks."
                }
              ]}
              advanced={[
                {
                  value: data?.results.length,
                  description: "Tournaments"
                },
                {
                  value: data
                    ? data.statistics.stdDevSpeaks
                      ? Math.round(data.statistics.stdDevSpeaks * 100) / 100
                      : '--'
                    : undefined,
                  description: "Avg. σ Speaks"
                },
                {
                  value: data?.statistics.lastActive,
                  description: "Last Active"
                },
                {
                  value: data ? data.statistics.inTop20Pct + 'x' : undefined,
                  description: "Top 20% Seed"
                },
                {
                  value: data?.statistics.avgOpWpM,
                  isPercentage: true,
                  round: 1,
                  description: "Avg. OpWpM"
                },
                {
                  value: data?.statistics.pWp,
                  isPercentage: true,
                  round: 1,
                  description: "Prelim Win Pct."
                },
                {
                  value: data ? data.statistics.breakPct || '--' : undefined,
                  isPercentage: true,
                  round: 1,
                  description: "Break Pct."
                },
                {
                  value: data?.statistics.tWp,
                  isPercentage: true,
                  round: 1,
                  description: "True Win Pct."
                }
              ]}
            />
          }
          subheading={data?.aliases[0]?.code}
        />
        <TournamentHistoryTable data={data?.results} />
        <TeamCharts results={data?.results.sort((a, b) => a.tournament.start - b.tournament.start) || []} />
      </div>
    </>
  )
}

interface TeamParams extends ParsedUrlQuery {
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

  const { id, circuit, season } = ctx.query as TeamParams;

  await ssg.team.summary.prefetch({
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

export default Team