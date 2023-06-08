import { Card } from '@shared/components';
import { Event } from '@shared/database';
import Overview from '@src/components/layout/Overview';
import Statistics from '@src/components/layout/Statistics';
import HeadToHeadRoundsTable from '@src/components/tables/head-to-head-rounds';
import getEventName from '@src/utils/get-event-name';
import { trpc } from '@src/utils/trpc';
import { NextSeo } from 'next-seo';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import React, { useEffect, useMemo } from 'react'
import { BsLightbulb } from 'react-icons/bs';
import { GiAtomicSlashes } from 'react-icons/gi';

interface HeadToHeadParams extends ParsedUrlQuery {
  event: string;
  circuit: string;
  season: string;
  team1: string;
  team2: string;
}

const HeadToHead = () => {
  const { query, isReady, asPath } = useRouter();
  const { data } = trpc.feature.headToHead.useQuery(
    {
      event: query.event as string,
      circuit: parseInt(query.circuit as string),
      season: parseInt(query.season as string),
      team1: query.team1 as string,
      team2: query.team2 as string,
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const team1Code = useMemo(() => data?.team1.ranking.team.aliases[0].code, [data]);
  const team2Code = useMemo(() => data?.team2.ranking.team.aliases[0].code, [data]);

  const SEO_TITLE = `Round Prediction: ${team1Code} vs ${team2Code}`;
  const SEO_DESCRIPTION = `Our prediction of the winning team in a round between ${team1Code} and ${team2Code}, exclusively on Debate Land.`;
  data?.team1.rounds
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
            url: `https://debate.land/api/og?title=${team1Code} vs ${team2Code}&label=Prediction`
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
          label="Judge"
          heading={
            data
              ? `${team1Code} vs ${team2Code}`
              : undefined
          }
          subtitle={
            isReady
              ? `${query.season} ${getEventName(query.event as Event)}`
              : undefined
          }
          underview={<></>}
        />
        <Card icon={<BsLightbulb />} title="Prediction" className="max-w-[800px] mx-auto my-16">

        </Card>
        <Card icon={<GiAtomicSlashes />} title="Clutch Factor" className="max-w-[800px] mx-auto my-16">
          <HeadToHeadRoundsTable data={data?.team1.rounds} />
          <HeadToHeadRoundsTable data={data?.team2.rounds} />
        </Card>
      </div>
    </>
  )
}

export default HeadToHead