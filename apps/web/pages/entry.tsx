/* eslint-disable no-underscore-dangle */
import Link from '../components/general/Link'
import Text from '../components/general/Text'
import Statistic from '../components/general/Statistic'
import React from 'react'
import { NextSeo } from 'next-seo'
// import TournamentListTable from '../components/TournamentListTable'
// import TournamentResult from '../types/tournament-result'
// import CareerSummaryTable from '../components/CareerSummaryTable'
import useTeamHistory from '../hooks/team-history'

// const data = {
//   _id: '123',
//   codes: ['Fremd CV', 'Illinois Independent Entry CV', 'William Fremd CV', 'AJ001'],
//   competitors: [
//     {
//       _id: 'abc',
//       name: 'Samarth Chitgopekar',
//     },
//     {
//       _id: 'def',
//       name: 'Adithya Vaidyanathan',
//     },
//   ],
//   schools: [
//     {
//       _id: 'ghi',
//       name: 'William Fremd High School',
//     },
//     {
//       _id: 'jkl',
//       name: 'Illinois Independent Entry',
//     },
//   ],
//   statistics: {
//     _id: 'mno',
//     prelim_record: [100, 20],
//     elim_record: [30, 5],
//     break_pct: 1,
//     avg_op_wpm: 0.412,
//     otr_score: 5.2,
//     rank: {
//       circuit: [
//         {
//           name: 'Illinois',
//           season: {
//             '2020': [8, 160],
//             '2021': [4, 140],
//             '2022': [1, 200],
//           },
//           all_time: [2, 2012],
//         },
//         {
//           name: 'National',
//           season: {
//             '2020': [951, 2412],
//             '2021': [305, 2206],
//             '2022': [42, 2507],
//           },
//           all_time: [307, 10021],
//         },
//       ],
//       event: {
//         season: {
//           '2020': [801, 8121],
//           '2021': [421, 7981],
//           '2022': [99, 10231],
//         },
//         all_time: [400, 41231],
//       },
//     },
//     speaking_results: [
//       {
//         _id: 'abc',
//         raw_avg: 28.7,
//         adj_avg: 29.15,
//       },
//       {
//         _id: 'def',
//         raw_avg: 29.0,
//         adj_avg: 29.21,
//       },
//     ],
//     bids: {
//       full: 12,
//       partial: 3,
//       ghost_full: 1,
//       ghost_partial: 0,
//     },
//   },
//   event: 'Public Forum',
//   circuits: ['Illinois', 'National'],
//   seasons: [2020, 2021, 2022],
//   tournaments: [
//     {
//       _id: 'pqr',
//       is_ghost_bid: false,
//       entry_id: '123',
//       tournament: {
//         _id: 'asd',
//         name: '45th Annual Harvard Open',
//         start_date: 1643650371000,
//         end_date: 1643823171000,
//         location: 'Cambridge, MA',
//         url: 'https://tabroom.com',
//         event: 'Public Forum',
//         event_url: 'https://tabroom.com',
//         prelim_url: 'https://tabroom.com',
//         tourn_id: 12321,
//         circuit: 'National',
//         season: 2022,
//         is_toc_qualifier: true,
//         bid_level: 'Octafinals',
//       },
//       code: 'Illinois Independent Entry CV',
//       competitors: ['abc', 'def'],
//       school: 'Illinois Independent Entry', // ID can be extracted with custom hash algorithm
//       prelim_rank: [1, 254],
//       prelim_record: [7, 0],
//       elim_record: [6, 0],
//       entry_page: 'https://tabroom.com/...',
//       speaking_results: [
//         {
//           _id: 'abc',
//           raw_avg: 28.7,
//           adj_avg: 29.15,
//         },
//         {
//           _id: 'def',
//           raw_avg: 29.0,
//           adj_avg: 29.21,
//         },
//       ],
//       bid: 'full',
//       op_wpm: 0.412,
//       otr_comp: 0.6,
//       prelim_rounds: [
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 1',
//           result: 'Win',
//           decision: [1, 0],
//           judges: ['John Doe'],
//           side: 'pro',
//           opponent: 'Strake AB', // ID can be extracted with custom hash algorithm
//           op_wp: 0.812,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 2',
//           result: 'Win',
//           decision: [1, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Blake CD', // ID can be extracted with custom hash algorithm
//           op_wp: 0.402,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 3',
//           result: 'Win',
//           decision: [1, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Palatine CD', // ID can be extracted with custom hash algorithm
//           op_wp: 0.242,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//       ],
//       elim_rounds: [
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Semifinals',
//           result: 'Win',
//           decision: [3, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Mission San Jose FG', // ID can be extracted with custom hash algorithm
//           op_wp: 0.401,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Finals',
//           result: 'Loss',
//           decision: [1, 2],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Pro',
//           opponent: 'Blake UV', // ID can be extracted with custom hash algorithm
//           op_wp: 0.352,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//       ],
//     },
//     {
//       _id: 'pqr',
//       is_ghost_bid: false,
//       entry_id: '123',
//       tournament: {
//         _id: 'asd',
//         name: 'ETHS Superb Owl',
//         start_date: 1643650371000,
//         end_date: 1643823171000,
//         location: 'Cambridge, MA',
//         url: 'https://tabroom.com',
//         event: 'Public Forum',
//         event_url: 'https://tabroom.com',
//         prelim_url: 'https://tabroom.com',
//         tourn_id: 12321,
//         circuit: 'National',
//         season: 2021,
//         is_toc_qualifier: true,
//         bid_level: 'Octafinals',
//       },
//       code: 'Illinois Independent Entry CV',
//       competitors: ['abc', 'def'],
//       school: 'Illinois Independent Entry', // ID can be extracted with custom hash algorithm
//       prelim_rank: [1, 254],
//       prelim_record: [7, 0],
//       elim_record: [6, 0],
//       entry_page: 'https://tabroom.com/...',
//       speaking_results: [
//         {
//           _id: 'abc',
//           raw_avg: 28.7,
//           adj_avg: 29.15,
//         },
//         {
//           _id: 'def',
//           raw_avg: 29.0,
//           adj_avg: 29.21,
//         },
//       ],
//       bid: 'full',
//       op_wpm: 0.412,
//       otr_comp: 0.6,
//       prelim_rounds: [
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 1',
//           result: 'Win',
//           decision: [1, 0],
//           judges: ['John Doe'],
//           side: 'pro',
//           opponent: 'Strake AB', // ID can be extracted with custom hash algorithm
//           op_wp: 0.812,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 2',
//           result: 'Win',
//           decision: [1, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Blake CD', // ID can be extracted with custom hash algorithm
//           op_wp: 0.402,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Round 3',
//           result: 'Win',
//           decision: [1, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Palatine CD', // ID can be extracted with custom hash algorithm
//           op_wp: 0.242,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//       ],
//       elim_rounds: [
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Semifinals',
//           result: 'Win',
//           decision: [3, 0],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Con',
//           opponent: 'Mission San Jose FG', // ID can be extracted with custom hash algorithm
//           op_wp: 0.401,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//         {
//           _id: 'stu',
//           name: 'R1',
//           name_std: 'Finals',
//           result: 'Loss',
//           decision: [1, 2],
//           judges: [
//             'John Doe', // ID can be extracted with custom hash algorithm
//           ],
//           side: 'Pro',
//           opponent: 'Blake UV', // ID can be extracted with custom hash algorithm
//           op_wp: 0.352,
//           speaking_results: [
//             {
//               _id: 'abc',
//               raw_avg: 28.7,
//               adj_avg: 29.15,
//             },
//             {
//               _id: 'def',
//               raw_avg: 29.0,
//               adj_avg: 29.21,
//             },
//           ],
//         },
//       ],
//     },
//   ],
// }

const Team = () => {
  const { history, isLoading, error } = useTeamHistory('7f6e1f6807d8416c6f5ac659')

  if (isLoading || error) {
    return <>hi</>
  }

  return (
    <>
      <NextSeo
        title={`Debate Land: ${history.results[0].alias.code}'s Profile`}
        description={`${history.results[0].alias.code}'s competitive statistics in __, exclusively on Debate Land.`}
        additionalLinkTags={[
          {
            rel: 'icon',
            href: '/favicon.ico',
          },
        ]}
      />
      <div className="min-h-screen">
        <div className="w-full flex flex-col bg-luka-100">
          <span className="h-[4.5rem]" />
          <div className="flex justify-center items-center w-full bg-luka-100 py-6">
            <div
              id="overview"
              className="flex flex-col md:flex-row items-center md:items-start lg:w-[1050px] justify-between lg:justify-center px-2 lg:px-0 pb-4"
            >
              <span id="entry-info" className="flex flex-col items-center md:items-start w-full p-2 md:max-w-[50%]">
                <Text size="sm" className="mb-1 bg-violet-300/70 px-2 !text-white rounded-xl">
                  ___
                </Text>
                {history.competitors.map((competitor, idx) => {
                  return (
                    <div className="flex space-x-1" key={idx}>
                      <Link
                        document
                        key={competitor.id}
                        className="text-xl sm:text-3xl lg:text-4xl"
                        href={`/competitors/${competitor.id}`}
                      >
                        {competitor.name}
                      </Link>
                      <Text className="!text-white text-xl sm:text-3xl lg:text-4xl">
                        {idx < history.competitors.length - 1 ? ' & ' : ''}
                      </Text>
                    </div>
                  )
                })}
                <Text size="sm" className="!text-gray-300/70 hidden md:inline mt-2 max-w-[500px] pr-4">
                  blah blah
                </Text>
              </span>
              <Text size="lg" className="!text-indigo-300 md:mt-4">
                FOO
              </Text>
            </div>
          </div>
          <div className="w-full flex justify-center border-y border-gray-300/40 bg-luka-200/70">
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
