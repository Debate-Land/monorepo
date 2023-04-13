import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import _ from 'lodash';
import { JudgingHistoryTable } from '@src/components/tables/judge';


const Judge = () => {
  const { query, isReady } = useRouter();
  const { data } = trpc.judge.summary.useQuery(
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

  const avgSpeaks = (data
    ? (_.mean(
      data.results
        .filter(r => r.avgRawPoints)
        .map(r => r.avgRawPoints) || [0]
    )).toFixed(1)
    : NaN) as number;

  const avgSpeakStdDev = (data
    ? (_.mean(
      data.results
        .filter(r => r.stdDevPoints)
        .map(r => r.stdDevPoints) || [0]
    )).toFixed(1)
    : NaN) as number;

  return (
    <>
      <NextSeo
        title={`Debate Land: ${data?.name || '--'}'s Profile`}
        description={`${data?.name[0] || '--'}'s judge statistics in ${query.event}, exclusively on Debate Land.`}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="min-h-screen">
        <Overview
          label="Judge"
          heading={
            data
              ? data.name
              : undefined
          }
          subtitle={
            data
              ? `${query.event || "All Events"} | ${data.rankings[0].circuit.name} | ${query.season || "All Seasons"}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: data ? data.index?.toFixed(1) : undefined,
                  description: "Judge Index"
                },
                {
                  value: data ? data.results?.length : undefined,
                  description: "Tournaments"
                },
                {
                  value: !isNaN(avgSpeaks) ? avgSpeaks : '--',
                  description: "Avg. Speaks"
                },
                {
                  value: !isNaN(avgSpeakStdDev) ? avgSpeakStdDev : '--',
                  description: "Avg. σ Speaks",
                }
              ]}
            />
          }
        />
        <JudgingHistoryTable data={data?.results} />
      </div>
    </>
  )
}

export default Judge