import { Card, Button, Select } from '@shared/components';
import { Paradigm } from '@shared/database'
import React, { useState } from 'react'
import { BiErrorCircle } from 'react-icons/bi';
import { BsCardText } from 'react-icons/bs';
import { HiOutlineSwitchHorizontal } from 'react-icons/hi';

interface ParadigmProps {
  data: Paradigm[];
}

const Paradigm = ({ data }: ParadigmProps) => {
  const [paradigm, setParadigm] = useState<Paradigm>(data[0])
  return (
    <Card icon={<BsCardText />} title="Paradigms" className="relative max-w-[800px] mx-auto my-16">
      <Select
        className="absolute right-1 border md:right-5 top-3 md:top-6 !w-32"
        options={data.map(d => ({ name: new Date(d.scrapedAt * 1000).toLocaleDateString('en-us'), value: d.id }))}
        onChange={(v) => setParadigm(data.find(d => d.id === parseInt(v)) as Paradigm)}
      />
      <div
        className="prose md:max-h-[600px] md:px-4 md:overflow-y-scroll dark:prose-invert prose-base prose-headings:my-2 prose-a:text-blue-400 w-full mx-auto"
        dangerouslySetInnerHTML={{ __html: paradigm.html.replaceAll('style="color: blue;"', '') }}
      />
    </Card>
  )
}

export default Paradigm