import React from 'react'
import Button from '../components/general/Button'
import Input from '../components/general/Input'
import Card from '../components/general/Card'
import Label from '../components/general/Label'
import { FaSearch } from 'react-icons/fa'
import Select from '../components/general/Select'
import { BiRadar } from 'react-icons/bi'
import Text from '../components/general/Text'
import DATASETS from '../const/datasets'

export const Radar = () => {
  const [query, setQuery] = React.useState('');
  const body = { event: 'Public Forum', circuit: 'National', season: '2020-21' }
  const [compass, setCompass] = React.useState(body)

  const executeQuery = () => null;

  return (
    <Card
      icon={<BiRadar />}
      title="Radar"
      className="min-w-full md:min-w-0 md:max-w-[600px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-purple-400/50"
    >
      <div className="flex justify-start w-full space-x-4 md:py-3">
        <Select
          options={Object.keys(DATASETS)}
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
