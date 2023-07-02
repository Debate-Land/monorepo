import { Button, Card, Histogram } from "@shared/components";
import { prisma } from "@shared/database";
import Overview from "@src/components/layout/Overview";
import StrikeTable from "@src/components/tables/radar/StrikeTable";
import { appRouter } from "@src/server/routers/_app";
import { trpc } from "@src/utils/trpc";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";
import React from "react";
import { AiOutlineLineChart } from "react-icons/ai";

interface StrikeSheetParams extends ParsedUrlQuery {
  tourn: string;
  pool: string;
}

const StrikeSheet = () => {
  const { query, isReady, asPath } = useRouter();
  const { data: judgeData } = trpc.scraping.strikes.useQuery(
    {
      tournId: parseInt(query.tourn as string),
      poolId: parseInt(query.pool as string),
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

  const SEO_TITLE = `${metadata?.name}: ${metadata?.location} Strike Sheet`;
  const SEO_DESCRIPTION = `Our analysis of the ${judgeData?.length} judges competing at ${metadata?.name} in ${metadata?.location}, exclusively on Debate Land.`;

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
              url: `https://debate.land/api/og?title=${metadata?.name}&label=Strike Sheet`,
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
        <Card
          icon={<AiOutlineLineChart />}
          title="Pool Analytics"
          className="max-w-[800px] mx-auto my-16 relative"
        >
          <Histogram
            data={
              judgeData?.map((d) =>
                d.rankings?.length ? d.rankings[0].index : 0
              ) || []
            }
            dataType="Index"
          />
        </Card>
        <StrikeTable data={judgeData || []} />
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

  const { tourn, pool } = ctx.query as StrikeSheetParams;

  await ssg.scraping.metadata.prefetch({
    id: parseInt(tourn),
  });

  await ssg.scraping.strikes.prefetch({
    tournId: parseInt(tourn),
    poolId: parseInt(pool),
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
  };
};

export default StrikeSheet;
