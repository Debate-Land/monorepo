import clsx from 'clsx'
import React, { ReactNode } from 'react'
import Character from './Character'
import Text from './Text'

export interface GroupProps {
  legend: string
  children: ReactNode
  character?: string
  className?: string
}

const Group = ({ legend, children, character, className }: GroupProps) => {
  return (
    <fieldset className="border-gray-400/50 border-[1px] rounded-md w-full flex flex-col items-start">
      <Text as="legend" className="ml-2 flex items-center" size="lg">
        {character && <Character size="md">{character}</Character>}
        {legend}
      </Text>
      <div className={clsx(className, 'mt-1 mb-3')}>{children}</div>
    </fieldset>
  )
}

export default Group
