import React, { useState } from 'react'
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
import { prisma } from '@shared/database';
import { omit } from 'lodash';
import TeamCharts from '@src/components/charts/TeamCharts';
import TeamInfoTable from '@src/components/tables/team/TeamInfoTable';
import FilterModal from '@src/components/features/FilterModal';
import TeamDifferentialTable from '@src/components/tables/team/TeamDifferentialTable';
import EmailModal from '@src/components/email/email-modal';
import { Button } from '@shared/components';
import { VscArrowSwap } from 'react-icons/vsc';
import { AiOutlineMail } from 'react-icons/ai'


type ActiveModal = "Email" | "Filter" | null;

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
      }),
      ...(query.topics && {
        topics: (query.topics as string).split(',').map(t => parseInt(t))
      }),
      ...(query.topicTags && {
        topicTags: (query.topicTags as string).split(',').map(t => parseInt(t))
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
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const SEO_TITLE = `${data?.aliases[0]?.code || '--'}'s Profile — Debate Land`;
  const SEO_DESCRIPTION = `${data?.aliases[0].code || '--'}'s competitive statistics for ${data ? getEnumName(data.circuits[0].event) : '--'}, exclusively on Debate Land.`;

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
        isOpen={activeModal == "Filter"}
        setIsOpen={(val) => setActiveModal(val ? "Filter" : null)}
        topics={ data ? data.filterData : [] }
      />
      <EmailModal
        isOpen={activeModal == "Email"}
        setIsOpen={(val) => setActiveModal(val ? "Filter" : null)}
        teamId={data?.id}
        subscriptionName={data?.aliases[0].code}
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

                <div className="flex flex-col w-full items-center space-y-1">
                  <p>{getEnumName(data.circuits[0].event)} | {data.circuits[0].name} | {data.seasons[0].id.toString()}</p>
                  <div className="flex w-fit">
                  <Button
                    onClick={() => setActiveModal("Filter")}
                    icon={<VscArrowSwap className="text-white" />}
                    _type="primary"
                    className="w-6 h-6 !mx-1 !p-0 !rounded"
                  />
                  <Button
                    onClick={() => setActiveModal("Email")}
                    icon={<AiOutlineMail className="text-white" />}
                    _type="primary"
                    className="w-6 h-6 !mx-1 !p-0 !rounded"
                    />
                  </div>
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
        <TeamDifferentialTable data={data?.results || []} />
        <TeamInfoTable aliases={data?.aliases} schools={data?.schools} />
      </div>
    </>
  )
}

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
      prisma
    },
  });

  const { id, circuit, season, topics, topicTags } = ctx.query as TeamParams;

  await ssg.team.summary.prefetch({
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

export default Team