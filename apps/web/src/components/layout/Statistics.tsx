import React from 'react'
import { Statistic } from '@shared/components';

interface RestrictedStatisticProp {
  value: string | number
  description: string
  round?: number
  isPercentage?: boolean
}

interface StatisticsProps {
  primary: RestrictedStatisticProp[];
  advanced?: RestrictedStatisticProp[]
}

const Statistics = ({primary, advanced}: StatisticsProps) => {
  return (
    <div
      id="stats"
      className="grid grid-cols-1 divide-y md:divide-y-0 border-gray-300/40 border-x divide-gray-500 md:grid-cols-2 w-full md:max-w-[800px]"
    >
      <div id="stats-main" className="grid grid-cols-4 w-full max-w-[400px] mx-auto">
        <Statistic
          {...primary[0]}
          primary
        />
        <Statistic
          {...primary[1]}
          primary
        />
        <Statistic
          {...primary[2]}
          primary
        />
        <Statistic
          {...primary[3]}
          primary
        />
      </div>
      {
        advanced && (
          <div id="stats-advanced" className="grid grid-cols-2 sm:grid-cols-4">
            <Statistic
              {...advanced[0]}
              className={{
                wrapper: 'border-gray-300/40 border-b border-r md:border-l',
              }}
            />
            <Statistic
              {...advanced[1]}
              className={{ wrapper: 'border-gray-300/40 border-b sm:border-r' }}
            />
            <Statistic
              {...advanced[2]}
              className={{ wrapper: 'border-gray-300/40 border-b border-r' }}
    
            />
            <Statistic
              {...advanced[3]}
              className={{ wrapper: 'border-gray-300/40 border-b' }}
    
            />
            <Statistic
              {...advanced[4]}
              className={{ wrapper: 'border-gray-300/40 border-b sm:border-b-0 border-r md:border-l' }}
            />
            <Statistic
              {...advanced[5]}
              className={{ wrapper: 'border-gray-300/40 border-b sm:border-b-0 sm:border-r' }}
            />
            <Statistic
              {...advanced[6]}
              className={{ wrapper: 'border-gray-300/40 border-r' }}
            />
            <Statistic
              {...advanced[7]}
            />
          </div>
        )
      }
    </div>
  )
}

export default Statistics