import clsx from 'clsx'
import React, { ReactNode } from 'react'

export interface CharacterProps {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const Character = ({ children: character, size }: CharacterProps) => {
  return (
    <span className={clsx(
      'flex justify-center items-center rounded-full opacity-80 mr-1 text-white',
      {
        'w-4 h-4 bg-gray-400 text-xs': size == 'sm',
        'w-5 h-5 bg-gray-600 dark:bg-white dark:text-gray-900 text-sm': size == 'md' || !size,
        'w-6 h-6 bg-gray-900 dark:text-black text-md': size == 'lg'
      }
    )}
    >
      {character}
    </span>
  )
}

export default Character
