import React from 'react'
import { Text, Button, Input, Group, Card, Select, Label } from '@shared/components'
import { FaRegCompass, FaSearch } from 'react-icons/fa'
import DATASETS from '@src/const/datasets'

const Compass = () => {
  const body = { event: 'Public Forum', circuit: 'National', season: '2020-21' }
  const [compass, setCompass] = React.useState(body)

  const [query, setQuery] = React.useState('')

  const executeQuery = () => null
  const goToBids = () => null
  const goToLeaderboard = () => null
  const goToTournaments = () => null

  return (
    <Card
      icon={<FaRegCompass />}
      title="Compass"
      className="min-w-full md:min-w-[300px] max-w-[800px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-sky-400/70 dark:shadow-sky-400/50 p-2"
    >
      <Group
        character="1"
        legend="Select a dataset"
        className="flex flex-col space-y-3 px-3 sm:flex-row sm:space-x-3 sm:space-y-0 sm:justify-around w-full"
      >
        <Select
          options={Object.keys(DATASETS)}
          initial={compass.event}
          onChange={(v) => setCompass({ ...compass, event: v })}
          label={<Label character="a">Event</Label>}
        />
        <Select
          // @ts-ignore
          options={Object.keys(DATASETS[compass.event])}
          initial={compass.circuit}
          onChange={(v) => setCompass({ ...compass, circuit: v })}
          label={<Label character="b">Circuit</Label>}
        />
        <Select
          // @ts-ignore
          options={DATASETS[compass.event][compass.circuit]}
          initial={compass.season}
          onChange={(v) => setCompass({ ...compass, season: v })}
          label={<Label character="c">Season</Label>}
        />
      </Group>
      <Group character="2" legend="Get your results" className="flex flex-col items-center space-y-3 w-full">
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
      </Group>
    </Card>
  )
}

export default Compass
