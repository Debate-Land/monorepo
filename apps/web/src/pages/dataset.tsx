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

const Dataset = () => {
  const { query, isReady } = useRouter();
  const { data } = trpc.dataset.useQuery(
    {
      circuit: parseInt(query.circuit as string),
      season: parseInt(query.season as string)
    },
    {
      enabled: isReady,
      // refetchOnWindowFocus: true,
      // refetchOnMount: false,
      // refetchOnReconnect: false,
      // staleTime: 1000 * 60 * 60 * 24,
    }
  );

  if (!data) return;
  console.log(data)
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
          heading={`${query.season as string} ${data.circuit?.name} ${data.circuit?.event}`}
          subtitle="exclusively on Debate Land"
          underview={
            <Statistics
              primary={[
                {
                  value: data.numTournaments as number,
                  description: "Tournaments"
                },
                {
                  value: data.numTeams as number,
                  description: "Teams"
                },
                {
                  value: data.numSchools as number,
                  description: "Schools"
                },
                {
                  value: data.numBids as number,
                  description: "Bids"
                }
              ]}
            />
          }
        />
        <LeaderboardTable count={data.numTeams}  />
        <TournamentTable count={data.numTournaments} />
        <CompetitorTable count={data.numCompetitors} />
        <JudgeTable count={data.numJudges} />
        {/* <SchoolTable /> */}
      </div>
    </>
  )
}

export default Dataset