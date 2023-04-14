import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { TournamentHistoryTable } from '@src/components/tables/team'
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';

// TODO: National Rank at some point...
const Team = () => {
  const { query, isReady } = useRouter();
  const { data } = trpc.team.summary.useQuery(
    {
      id: query.id as string,
      event: query.event as string,
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

  return (
    <>
      <NextSeo
        title={`Debate Land: ${data?.aliases[0]?.code || '--'}'s Profile`}
        description={`${data?.aliases[0].code || '--'}'s competitive statistics in ${query.event}, exclusively on Debate Land.`}
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
              ? `${query.event} | ${data.circuits[0].name} | ${data.seasons[0].id}-${data.seasons[data.seasons.length - 1].id}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? Math.round(data.statistics.otr * 100) / 100 : undefined,
                  description: "OTR Score"
                },
                {
                  value: data ? data.statistics.inTop20Pct + 'x' : undefined,
                  description: "Top 20% Seed"
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
                  value: data ? `${data.statistics.pRecord[0]}-${data.statistics.pRecord[1]}` : undefined,
                  description: "Prelim Rcd."
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
        />
        <TournamentHistoryTable data={data?.results} />
        {/* TODO: Alias/School Tables & Charts */}
      </div>
    </>
  )
}

export default Team