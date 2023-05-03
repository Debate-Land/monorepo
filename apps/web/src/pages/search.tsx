import React from 'react'
import { trpc } from '@src/utils/trpc'
import { useRouter } from 'next/router'
import Overview from '@src/components/layout/Overview';
import { NextSeo } from 'next-seo';
import { Card } from '@shared/components';
import { FaSearch } from 'react-icons/fa';
import SearchResult from '@src/components/search-result';
import omit from 'lodash/omit';

const Search = () => {
  const { query, isReady, asPath, ...router } = useRouter();
  const { data } = trpc.feature.search.useQuery(
    {
      query: query.query as string,
      ...(query.season && { season: parseInt(query.season as string) }),
      ...(query.circuit && { circuit: parseInt(query.circuit as string) }),
    },
    {
      enabled: isReady,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 1000 * 60 * 60 * 24,
    }
  );

  const SEO_TITLE = "Compass Search";
  const SEO_DESCRIPTION = "Find Leaderboards, Teams, Competitors, Judges, Tournaments, and more with ease.";

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
            url: `https://debate.land/api/og?title=${SEO_TITLE}&label=Search`
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
          label="Search"
          heading={`Results for "${query.query as string}"`}
          subtitle="exclusively on Debate Land"
          underview={
            <div className='py-3 uppercase' style={{ letterSpacing: '0.1em' }}>
              <p className="bg-gradient-to-r from-sky-400 via-purple-500 to-red-400 text-transparent bg-clip-text text-center">Searching Teams, Competitors, Judges, and Tournaments</p>
            </div>
          }
        />
        <Card
          title="Results"
          icon={<FaSearch className="text-xl md:text-2xl lg:text-3xl" />}
          className="min-w-full md:min-w-[300px] max-w-[700px] m-10 mx-auto p-2"
        >
          {
            data && data.length
              ? data.map(({ name, id, type }) => (
                <SearchResult
                  name={name}
                  tag={type}
                  key={id}
                  onClick={() => {
                    let pathname;
                    switch (type) {
                      case 'Team':
                        pathname = `/teams/${id}`;
                        break;
                      case 'Competitor':
                        pathname = `/competitors/${id}`
                        break;
                    }
                    router.push({
                      pathname,
                      query: omit(query, ['query', 'event'])
                    })
                  }}
                />
              ))
              : data
                ? (
                  <p className="w-full text-center text-red-400">
                    Whoops! We searched far and wide, but came up short. Try again?
                  </p>
                )
                : null
          }
        </Card>
      </div>
    </>
  )
}

export default Search