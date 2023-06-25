import { prisma } from "@shared/database";
import Overview from "@src/components/layout/Overview";
import ThreatTable from "@src/components/tables/radar/ThreatTable";
import { appRouter } from "@src/server/routers/_app";
import { trpc } from "@src/utils/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";

interface ThreatSheetParams extends ParsedUrlQuery {
  tourn: string;
  event: string;
}

const ThreatSheet = () => {
  const { query, isReady, asPath } = useRouter();
  const { data: teamData } = trpc.scraping.threats.useQuery(
    {
      tournId: parseInt(query.tourn as string),
      eventId: parseInt(query.event as string),
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );
  const { data: metadata } = trpc.scraping.metadata.useQuery({
    id: parseInt(query.tourn as string),
  });

  const SEO_TITLE = `${metadata?.name}: ${metadata?.location} Threat Sheet`;
  const SEO_DESCRIPTION = `Our analysis of the ${teamData?.length} teams competing at ${metadata?.name} in ${metadata?.location}, exclusively on Debate Land.`;

  return (
    <>
      <NextSeo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        openGraph={{
          title: SEO_TITLE,
          description: SEO_DESCRIPTION,
          type: "website",
          url: `https://debate.land${asPath}`,
          images: [
            {
              url: `https://debate.land/api/og?title=${metadata?.name}&label=Threat Sheet`,
            },
          ],
        }}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "/favicon.ico",
          },
        ]}
        noindex
      />
      <div className="min-h-screen">
        <Overview
          label="Threat Sheet"
          heading={metadata?.name}
          subtitle={metadata?.location}
          underview={<></>}
        />
        <ThreatTable data={teamData || []} />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: {
      prisma,
    },
  });

  const { tourn, event } = ctx.query as ThreatSheetParams;

  await ssg.scraping.metadata.prefetch({
    id: parseInt(tourn),
  });

  await ssg.scraping.threats.prefetch({
    tournId: parseInt(tourn),
    eventId: parseInt(event),
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default ThreatSheet;
