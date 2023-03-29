import React, { ReactNode } from 'react'
import Character from './Character'
import Text from './Text'

export interface LabelProps {
  children: ReactNode
  character?: string
  [key: string]: any
}

const Label = ({ children, character, ...props }: LabelProps) => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Text className="flex items-center mb-1 text-gray-500 dark:!text-gray-400" size="sm" {...props}>
      {character && <Character size="sm">{character}</Character>}
      {children}
    </Text>
  )
}

export default Label
