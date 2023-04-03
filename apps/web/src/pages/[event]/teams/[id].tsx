import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { TournamentListTable } from '@src/components/tables'
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';

// TODO: National Rank at some point...
const Team = () => {
  const { query, isReady } = useRouter();
  const { data } = trpc.team.useQuery(
    {
      id: query.id as string,
      event: query.event as string,
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  if (!data) return;

  return (
    <>
      <NextSeo
        title={`Debate Land: ${data.aliases[0]?.code}'s Profile`}
        description={`${data.aliases[0].code}'s competitive statistics in ${query.event}, exclusively on Debate Land.`}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="min-h-screen">
        <Overview
          label="Team"
          heading={
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
          }
          subtitle={`${query.event} | ${data.circuits[0].name} | ${data.seasons[0].id}-${data.seasons[data.seasons.length - 1].id}`}
          underview={
            <Statistics
              primary={[
                {
                  value: Math.round(data.statistics.otr * 100) / 100,
                  description: "OTR Score"
                },
                {
                  value: data.statistics.inTop20Pct + 'x',
                  description: "Top 20% Prelim Seed"
                },
                {
                  value: data.statistics.bids,
                  description: `TOC Bid${data.statistics.bids > 1 ? 's' : ''}`
                },
                {
                  value: Math.round(data.statistics.avgSpeaks * 10) / 10,
                  description: "Avg Raw Spks."
                }
              ]}
              advanced={[
                {
                  value: data.results.length,
                  description: "Tournaments"
                },
                {
                  value: data._count.rounds,
                  description: "Rounds"
                },
                {
                  value: data.statistics.lastActive,
                  description: "Last Active"
                },
                {
                  value: data.statistics.avgOpWpM,
                  isPercentage: true,
                  round: 1,
                  description: "Avg. OpWpM"
                },
                {
                  value: `${data.statistics.pRecord[0]}-${data.statistics.pRecord[1]}`,
                  description: "Prelim Rcd."
                },
                {
                  value: data.statistics.pWp,
                  isPercentage: true,
                  round: 1,
                  description: "Prelim Win Pct."
                },
                {
                  value: data.statistics.breakPct,
                  isPercentage: true,
                  round: 1,
                  description: "Break Pct."
                },
                {
                  value: data.statistics.tWp,
                  isPercentage: true,
                  round: 1,
                  description: "True Win Pct."
                }
              ]}
            />
          }
        />
        <TournamentListTable data={data.results} />
        {/* TODO: Alias/School Tables & Charts */}
      </div>
    </>
  )
}

export default Team