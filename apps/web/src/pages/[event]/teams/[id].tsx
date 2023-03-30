import React from 'react'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc';
import { Statistic, Link, Text } from '@shared/components';
import { CareerSummaryTable, TournamentListTable } from '@src/components/tables'
import { NextSeo } from 'next-seo';

const Team = () => {
  const { query, isReady } = useRouter();
  if (!isReady) return; // FIXME: Bad for SEO

  const { data } = trpc.team.useQuery({
    id: query.id as string,
    event: query.event as string,
  });

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
        <div className="w-full flex flex-col bg-luka-100 overflow-hidden">
          <span className="h-[4rem]" />
          <div className="flex justify-center items-center w-full bg-luka-100 py-6">
            <div
              id="overview"
              className="flex flex-col md:flex-row items-center md:items-start lg:w-[1050px] justify-between lg:justify-center px-2 lg:px-0 pb-4"
            >
              <span id="entry-info" className="flex flex-col items-center md:items-start w-full p-2 md:max-w-[50%] relative">
                <div id="blob1" className='absolute hidden lg:block -top-50 right-0 w-72 h-72 bg-yellow-600 rounded-full mix-blend-lighten filter blur-xl' />
                <div id="blob2" className='absolute hidden lg:block top-50 right-100 w-72 h-72 bg-sky-500 rounded-full mix-blend-lighten filter blur-xl' />
                <div id="blob2" className='absolute hidden lg:block -top-8 right-28 w-72 h-72 bg-purple-500 rounded-full mix-blend-lighten filter blur-xl' />
                <Text size="sm" className="mb-1 bg-violet-300/70 px-2 !text-white rounded-xl">
                  {data.results[0]?.school?.name}
                </Text>
                {data.competitors.map((competitor, idx) => {
                  return (
                    <div className="flex space-x-1 z-10">
                      <Link
                        document
                        key={competitor.id}
                        className="text-xl sm:text-3xl lg:text-4xl"
                        href={`/competitors/${competitor.id}`}
                      >
                        {competitor.name}
                      </Link>
                      <Text className="!text-white text-xl sm:text-3xl lg:text-4xl">
                        {idx < data.competitors.length - 1 ? ' & ' : ''}
                      </Text>
                    </div>
                  )
                })}
                {/* <Text size="sm" className="!text-gray-300/70 hidden md:inline mt-2 max-w-[500px] pr-4">
                  {data.competitors.length === 1
                    ? data.competitors[0].name.split(' ')[0]
                    : data.competitors.map((competitor) => competitor.name.split(' ')[0]).join(' & ')}{' '}
                  {data.competitors.length > 1 ? 'have' : 'has'} competed for {data.seasons.length}{' '}
                  {data.seasons.length > 1 ? 'seasons' : 'season'} ({data.seasons.join(', ')}) on {data.circuits.length}{' '}
                  circuits ({data.circuits.join(', ')}). Their peak{' '}
                  {data.statistics.rank.circuit.length > 1 ? 'ranks are' : 'rank is'}{' '}
                  {data.statistics.rank.circuit
                    .map((circuit) => {
                      const seasons = Object.keys(circuit.season)
                      let high = [circuit.season[seasons[0]][0], seasons[0]]
                      for (let i = 1; i < seasons.length; i++) {
                        if (circuit.season[seasons[i]][0] < high[0]) {
                          high = [circuit.season[seasons[i]][0], seasons[i]]
                        }
                      }
                      return `#${high[0]} (${circuit.name}) in ${high[1]}`
                    })
                    .join(' and ')}
                  . They have competed in {data.results.length}{' '}
                  {data.results.length > 1 ? 'tournaments' : 'tournament'}, amassing {5} TOC bids.
                </Text> */}
              </span>
              {/* <Text size="lg" className="!text-indigo-300 md:mt-4">
                {query.event} | {data.circuits[0]} | {data.seasons[0]}-{data.seasons[data.seasons.length - 1]}
              </Text> */}
            </div>
          </div>
          <div className="w-full flex justify-center border-y border-gray-300/40 bg-luka-200 z-20">
            <div
              id="stats"
              className="grid grid-cols-1 divide-y md:divide-y-0 border-gray-300/40 border-x divide-gray-500 md:grid-cols-2 w-full md:max-w-[800px]"
            >
              <div id="stats-main" className="grid grid-cols-4 w-full max-w-[400px] mx-auto">
                <Statistic value={4.1} description="OTR Score" primary />
                <Statistic value="#3" description="Ntl. Rank" primary />
                <Statistic value={8.5} description="TOC Bids" primary />
                <Statistic
                  value="97%"
                  description="Spkr. Pctl."
                  className={{ wrapper: '!border-r-0', inner: '!border-r-0' }}
                  primary
                />
              </div>
              <div id="stats-advanced" className="grid grid-cols-2 sm:grid-cols-4">
                <Statistic
                  value={21}
                  description="Tournaments"
                  className={{
                    wrapper: 'border-gray-300/40 border-b border-r md:border-l',
                  }}
                />
                <Statistic
                  value={103}
                  description="Rounds"
                  className={{ wrapper: 'border-gray-300/40 border-b sm:border-r' }}
                />
                <Statistic
                  value="70.1%"
                  description="True Win Pct."
                  className={{ wrapper: 'border-gray-300/40 border-b border-r' }}
                />
                <Statistic
                  value="100%"
                  description="Break Pct."
                  className={{ wrapper: 'border-gray-300/40 border-b' }}
                />
                <Statistic
                  value="40.2%"
                  description="Avg. OpWPM"
                  className={{ wrapper: 'border-gray-300/40 border-b sm:border-b-0 border-r md:border-l' }}
                />
                <Statistic
                  value="6W"
                  description="Streak"
                  className={{ wrapper: 'border-gray-300/40 border-b sm:border-b-0 sm:border-r' }}
                />
                <Statistic
                  value="2 mo."
                  description="Last Active"
                  className={{ wrapper: 'border-gray-300/40 border-r' }}
                />
                <Statistic value="75.4%" description="Prelim Win Pct." />
              </div>
            </div>
          </div>
        </div>
        {/* <CareerSummaryTable data={data.tournaments as unknown as TournamentResult[]} />
        <TournamentListTable data={data.tournaments as unknown as TournamentResult[]} /> */}
      </div>
    </>
  )
}

export default Team