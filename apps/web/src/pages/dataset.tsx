import { NextSeo } from 'next-seo'
import React from 'react'
import { trpc } from '@src/utils/trpc'
import { useRouter } from 'next/router';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import {CompetitorTable, TournamentTable, SchoolTable, LeaderboardTable, JudgeTable, BidTable} from '@src/components/tables/dataset';
import getEventName from '@src/utils/get-event-name';

const Dataset = () => {
  const { query, isReady } = useRouter();
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

  const label = `${query.season as string} ${data?.circuit?.name} ${getEventName(data?.circuit?.event)}`;

  return (
    <>
      <NextSeo
        title={`Debate Land: Dataset`}
        description={`${data ? label : '--'} dataset, exclusively on Debate Land.`}
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
                  value: data?.numTournaments,
                  description: "Tournaments"
                },
                {
                  value: data?.numTeams,
                  description: "Teams"
                },
                {
                  value: data?.numSchools,
                  description: "Schools"
                },
                {
                  value: data?.numBids || undefined,
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

export default Dataset