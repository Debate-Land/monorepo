import React from 'react'
import { Button, Input, Card, Select, Label } from '@shared/components'
import { FaSearch } from 'react-icons/fa'
import { VscTelescope } from 'react-icons/vsc'

const Telescope = () => {
  const [query, setQuery] = React.useState('');
  const body = { event: 'Public Forum', circuit: 'National', season: '2020-21' }
  const [compass, setCompass] = React.useState(body)

  const executeQuery = () => null;

  return (
    <Card
      icon={<VscTelescope />}
      title="Telescope"
      theme="text-red-400"
      className="min-w-full md:min-w-[600px] md:max-w-[600px] m-10 mx-auto bg-sky-100 dark:bg-black shadow-2xl shadow-red-400/50 p-2"
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
            label={<Label>Judge Name</Label>}
            placeholder='eg. "Sonny Patel"'
            className="w-full"
          />
          <Button onClick={executeQuery} icon={<FaSearch />} type="primary" className="w-8 h-8 mt-6 !mx-0 !ml-3" />
        </div>
      </div>
    </Card>
  )
}

export default Telescope
