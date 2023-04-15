import React, { useEffect } from 'react'
import { Text, Button, Input, Group, Card, Select, Label } from '@shared/components'
import { FaRegCompass, FaSearch } from 'react-icons/fa'
import DATASETS from '@src/const/datasets'
import { Event } from '@shared/database'
import { useRouter } from 'next/router'
import { trpc } from '@src/utils/trpc'

interface CompassQuery {
  event: Event;
  circuit?: number;
  season?: number;
}

interface Option {
  name: string;
  value: number;
}

const Compass = () => {
  const router = useRouter();
  const [query, setQuery] = React.useState<CompassQuery>({
    event: "PublicForum" // Initial Config.
  });
  const { data: circuits } = trpc.feature.circuits.useQuery({
    event: query.event,
  });
  const { data: seasons } = trpc.feature.seasons.useQuery(
    {
      circuit: query.circuit!,
    },
    {
      enabled: !!query.circuit
    }
  );

  const getDataset = () => {
    const { event, circuit, season } = query;
    if (event && circuit && season) {
      router.push({
        pathname: '/dataset',
        query: {
          event,
          circuit,
          season
        }
      })
    }
  }

  console.log(seasons)
  return (
    <Card
      icon={<FaRegCompass />}
      title="Compass"
      className="min-w-full md:min-w-[300px] max-w-[800px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-sky-400/70 dark:shadow-sky-400/50 p-2"
    >
      <div className="flex flex-col space-y-3 px-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-around w-full">
        <Select
          options={[
            {
              name: "Public Forum",
              value: "PublicForum"
            },
            {
              name: "Lincoln Douglas",
              value: "LincolnDouglas"
            },
            {
              name: "Policy",
              value: "Policy"
            },
            {
              name: "Parlimentary",
              value: "Parlimentary"
            },
          ]}
          onChange={(v: string) => setQuery({ ...query, event: v as Event })}
          label={<Label character="a">Event</Label>}
        />
        <Select
          // @ts-ignore
          options={circuits?.map(d => ({ name: d.name, value: d.id})) || []}
          onChange={(v: string) => setQuery({ ...query, circuit: parseInt(v) })}
          label={<Label character="b">Circuit</Label>}
        />
        <Select
          // @ts-ignore
          options={seasons?.map() || []}
          onChange={(v) => setQuery({ ...query, season: parseInt(v) })}
          enabled={false}
          label={<Label character="c">Season</Label>}
        />
        <div className="flex h-full items-center justify-center">
          <Button onClick={getDataset} icon={<FaSearch />} type="primary" className="w-8 h-8 mt-6 !p-0" />
        </div>
      </div>
      {/* <Group character="2" legend="Get your results" className="flex flex-col items-center space-y-3 w-full">
        <div className="flex w-full justify-between px-5">
          <Input
            onChange={(t) => setQuery(t)}
            onSubmit={executeQuery}
            label={<Label>Search individual entries</Label>}
            placeholder='eg. "John Doe" or "Blake AB"'
            className="w-full"
          />
          <Button onClick={executeQuery} icon={<FaSearch />} type="primary" className="w-8 h-8 mt-6 !mx-0 !ml-3" />
        </div>
        <Text className="text-gray-500 pt-3">— OR —</Text>
        <div className="flex flex-col items-start w-full px-5">
          <div className="w-full flex flex-col space-y-3 sm:flex-row sm:justify-center sm:space-y-0 dark:border-gray-600 py-4 rounded-md">
            <Button onClick={goToLeaderboard} type="primary">
              Leaderboard
            </Button>
            <Button onClick={goToBids} type="primary" className="min-w-[25%]">
              Bid List
            </Button>

            <Button onClick={goToTournaments} type="primary">
              Tournaments
            </Button>
          </div>
        </div>
      </Group> */}
    </Card>
  )
}

export default Compass
