import React from 'react'
import { Text, Button, Input, Card, Select, Label } from '@shared/components'
import { FaSearch } from 'react-icons/fa'
import { BiRadar } from 'react-icons/bi'

const Radar = () => {
  const [query, setQuery] = React.useState('');
  const body = { event: 'Public Forum', circuit: 'National', season: '2020-21' }
  const [compass, setCompass] = React.useState(body)

  const executeQuery = () => null;

  return (
    <Card
      icon={<BiRadar />}
      title="Radar"
      theme="text-indigo-400"
      className="min-w-full md:min-w-0 md:max-w-[600px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-purple-500/50 p-2"
    >
      <div className="flex justify-start w-full space-x-4 md:py-3">
        <Select
          options={[]}
          initial={compass.event}
          onChange={(v) => setCompass({ ...compass, event: v })}
          label={<Label>Event</Label>}
        />
        <div className="flex w-full justify-between">
          <Input
            onChange={(t) => setQuery(t)}
            onSubmit={executeQuery}
            label={<Label>Tabroom Entries URL</Label>}
            placeholder='eg. "https://www.tabroom.com/index/tourn/fields.mhtml?tourn_id=20143&event_id=174061"'
            className="w-full"
          />
          <Button onClick={executeQuery} icon={<FaSearch />} type="primary" className="w-8 h-8 mt-6 !mx-0 !ml-3" />
        </div>
      </div>
      <Text className="text-[0.7rem]">
        Need help? Try using https://www.tabroom.com/index/tourn/fields.mhtml?tourn_id=20143&event_id=174061
      </Text>
    </Card>
  )
}

export default Radar
