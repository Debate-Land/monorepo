import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { TournamentHistoryTable } from '@src/components/tables/team'
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import getEnumName from '@src/utils/get-enum-name';
import { appRouter } from '../../server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Topic, TopicTag, prisma } from '@shared/database';
import { omit } from 'lodash';
import TeamCharts from '@src/components/charts/TeamCharts';
import TeamInfoTable from '@src/components/tables/team/TeamInfoTable';
import { BsFilter } from 'react-icons/bs';
import { FaExchangeAlt } from 'react-icons/fa';
import { AiOutlineSwap } from 'react-icons/ai';
import FilterModal from '@src/components/features/FilterModal';

// TODO: National Rank at some point...
const Team = () => {
  const { query, isReady, asPath, ...router } = useRouter();
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
  const [filterModalIsOpen, setFilterModalIsOpen] = useState<boolean>(false);

  const SEO_TITLE = `${data?.aliases[0]?.code || '--'}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${data?.aliases[0].code || '--'}'s competitive statistics for ${getEnumName(data?.circuits[0].event)}, exclusively on Debate Land.`;

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
      <FilterModal
        isOpen={filterModalIsOpen}
        setIsOpen={setFilterModalIsOpen}
        topics={
          data
            ? data.results
              .map(r => r.tournament.topic)
              .filter(t => t !== null) as (Topic & { tags: TopicTag[] })[]
            : []
        }
      />
      <div className="min-h-screen">
        <Overview
          label="Team"
          heading={
            data
              ? (
                <>
                  <button onClick={() => router.push({
                    pathname: `/competitors/${data.competitors[0].id}`,
                    query: omit(query, 'id')
                  })}>
                    {data.competitors[0].name}
                  </button>
                  {
                    data.competitors.length > 1 && (
                      <span>
                        {' & '}
                        <button onClick={() => router.push({
                          pathname: `/competitors/${data.competitors[1].id}`,
                          query: omit(query, 'id')
                        })}>
                          {data.competitors[1].name}
                        </button>
                      </span>
                    )
                  }
                </>
              )
              : undefined
          }
          subtitle={
            data
              ? (
                <div className="flex items-center space-x-1 lg:space-x-2">
                  <p>{getEnumName(data.circuits[0].event)} | {data.circuits[0].name} | {data.seasons[0].id}</p>
                  <button
                    className="p-px bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 rounded group-hover:shadow-halo group-hover:scale-110 transition-all"
                    onClick={() => setFilterModalIsOpen(true)}
                  >
                    <AiOutlineSwap className="text-white text-sm lg:text-xl" />
                  </button>
                </div>
              )
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
        <TeamInfoTable aliases={data?.aliases} schools={data?.schools} />
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