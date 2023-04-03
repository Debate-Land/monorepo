import { NextSeo } from 'next-seo'
import React from 'react'
import { trpc } from '@src/utils/trpc'
import { useRouter } from 'next/router';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import LeaderboardTable from '@src/components/tables/LeaderboardTable';
import SchoolTable from '@src/components/tables/SchoolTable';
import TournamentTable from '@src/components/tables/TournamentTable';
import CompetitorTable from '@src/components/tables/CompetitorTable';
import JudgeTable from '@src/components/tables/JudgeTable';
import BidTable from '@src/components/tables/BidTable';

const Dataset = () => {
  const { query, isReady } = useRouter();
  const { data } = trpc.dataset.useQuery(
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

  return (
    <>
      <NextSeo
        title={`Debate Land: --`}
        description={`--, exclusively on Debate Land.`}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="min-h-screen">
        <Overview
          label="Dataset"
          heading={
            data
              ? `${query.season as string} ${data.circuit?.name} ${data.circuit?.event}`
              : 'LOADER'
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
        <LeaderboardTable count={data?.numTeams || 50}  />
        <TournamentTable count={data?.numTournaments || 50} />
        <CompetitorTable count={data?.numCompetitors || 50} />
        <JudgeTable count={data?.numJudges || 50} />
        <SchoolTable count={data?.numSchools || 50} />
        <BidTable count={data?.numBids! || 50} />
      </div>
    </>
  )
}

export default Dataset