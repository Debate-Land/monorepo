import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { NextSeo } from 'next-seo';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import _ from 'lodash';
import { JudgingHistoryTable } from '@src/components/tables/judge';

// TODO: National Rank at some point...
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
          label="Team"
          heading={
            data
              ? data.name
              : undefined
          }
          subtitle={
            data
              ? `${query.event || "All Events"} | ${query.circuit || "All Circuits"} | ${query.season || "All Seasons"}`
              : undefined
          }
          underview={
            <Statistics
              primary={[
                {
                  value: '--',
                  description: "Tournaments"
                },
                {
                  value: data ? data.records.length : undefined,
                  description: "Rounds"
                },
                {
                  value: data
                    ? _.mean(data.records
                      .filter(r => r.avgSpeakerPoints)
                      .map(r => r.avgSpeakerPoints) || [0]).toFixed(1) || '--'
                    : undefined,
                  description: "Avg. Speaks"
                },
                {
                  value: data ?
                    (
                      () => {
                        let points = data.records
                          .map(r => r.avgSpeakerPoints)
                          .filter(pts => pts !== null) as number[];
                        let mean = _.mean(points);
                        return _.mean(points.map(pts => Math.abs(pts - mean))).toFixed(2);
                      }
                    )()
                    : undefined,
                  description: "σ Speaks"
                }
              ]}
            />
          }
        />
        <JudgingHistoryTable data={data?.records} />
        {/* TODO: Alias/School Tables & Charts */}
      </div>
    </>
  )
}

export default Judge