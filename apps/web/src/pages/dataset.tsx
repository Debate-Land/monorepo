import { NextSeo } from 'next-seo'
import React from 'react'
import { trpc } from '@src/utils/trpc'
import { useRouter } from 'next/router';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import {CompetitorTable, TournamentTable, SchoolTable, LeaderboardTable, JudgeTable, BidTable} from '@src/components/tables/dataset';
import getEnumName from '@src/utils/get-enum-name';
import { prisma } from '@shared/database';
import { appRouter } from '@src/server/routers/_app';
import { createProxySSGHelpers } from '@trpc/react-query/ssg';
import { GetServerSideProps } from 'next';
import { ParsedUrlQuery } from 'querystring';

const Dataset = () => {
  const { query, isReady, asPath } = useRouter();
  const { data } = trpc.dataset.summary.useQuery(
    {
      circuit: parseInt(query.circuit as string),
      season: parseInt(query.season as string)
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const label = `${query.season as string} ${data?.circuit?.name} ${getEnumName(data?.circuit?.event)}`;

  const SEO_TITLE = `${label} Dataset — Debate Land`;
  const SEO_DESCRIPTION = `The latest ${label} dataset, exclusively on Debate Land.`;

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
            url: `https://debate.land/api/og?title=${label}&label=Dataset`
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
          label="Dataset"
          heading={
            data
              ? label
              : undefined
          }
          subtitle="exclusively on Debate Land"
          underview={
            <Statistics
              primary={[
                {
                  value: data ? data.numTournaments === 0 ? '--' : data.numTournaments : undefined,
                  description: "Tournaments"
                },
                {
                  value: data ? data.numTeams === 0 ? 0 : data.numTeams : undefined,
                  description: "Teams"
                },
                {
                  value: data ? data.numSchools === 0 ? 0 : data.numSchools : undefined,
                  description: "Schools"
                },
                {
                  value: data
                    ? data.numBids === 0
                      ? data.circuit?.event === "Parlimentary"
                        ? '--'
                        : 0
                      : data.numBids
                    : undefined,
                  description: "Bids"
                }
              ]}
            />
          }
        />
        <LeaderboardTable count={data?.numTeams || 50} />
        <JudgeTable count={data?.numJudges || 50} />
        <TournamentTable count={data?.numTournaments || 50} />
        <BidTable event={data?.circuit?.event} />
        <SchoolTable count={data?.numSchools || 50} />
        <CompetitorTable count={data?.numCompetitors || 50} />
      </div>
    </>
  )
}

interface DatasetParams extends ParsedUrlQuery {
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

  const { circuit, season } = ctx.query as DatasetParams;

  await ssg.dataset.summary.prefetch({
    circuit: parseInt(circuit),
    season: parseInt(season)
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }
  }
}

export default Dataset