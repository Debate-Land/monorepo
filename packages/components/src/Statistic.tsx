import clsx from 'clsx'
import React from 'react'
import Text from './Text'

export interface StatisticProps {
  value?: string | number
  description: string
  primary?: boolean
  className?: {
    wrapper?: string
    inner?: string
    value?: string
    description?: string
  },
  round?: number;
  isPercentage?: boolean;
}

const Statistic = ({ value, description, primary, className, round, isPercentage }: StatisticProps) => {
  if (round && value && typeof value !== 'string') {
    value = Math.round(value as number * (isPercentage ? 100 : 0) * Math.pow(10, round)) / Math.pow(10, round);
  }

  return (
    <div className={clsx('flex flex-col', className?.wrapper, { 'h-full py-4 border-gray-300/40 md:border-r': primary })}>
      <div
        className={clsx(
          'flex flex-col items-center justify-start min-w-full mx-auto my-auto !text-white',
          {
            'h-[3rem] md:h-[4rem] md:py-1 border-gray-300/40 border-r md:border-r-0': primary,
            'h-[4rem] pt-[0.45rem]': !primary,
          },
          className?.inner,
        )}
      >
        <Text className={
          clsx(
            {
              'text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-sky-400': primary && value,
              'bg-gray-300/40 dark:bg-gray-700/40 animate-pulse rounded': value === undefined,
              'w-16 min-h-[2rem]': primary && value === undefined,
              'w-16 min-h-[1.5rem]': !primary && value === undefined,
            },
            className?.value
          )
        }>
          {value || ''}{value && typeof value !== 'string' && isPercentage ? '%' : ''}
        </Text>
        <Text size="xs" className={clsx('text-center px-2', className?.description)}>
          {description}
        </Text>
      </div>
    </div>
  )
}

export default Statistic
