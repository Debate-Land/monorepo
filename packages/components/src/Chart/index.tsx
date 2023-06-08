import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { CustomTick, DateTick, PercentageTick } from './CustomTick';

interface ChartProps<T> {
  title: string;
  data: T[];
  xKey: string & keyof T;
  yKey: string & keyof T;
  range: number[];
  yTicks: number[];
  isPercentage?: boolean;
  isBoolean?: boolean;
}

const Chart = <T,>({ title, data, xKey, yKey, yTicks, range, isPercentage, isBoolean }: ChartProps<T>) => {

  return (
    <div className='w-fit flex flex-col items-center'>
      <h3 className='ml-12 mb-2 text-gray-600 dark:text-gray-500'>{title}</h3>
      <LineChart
        width={300}
        height={200}
        data={data}
        title={title}
        margin={{ top: 10, bottom: 5 }}
      >
        <Line
          type="monotone"
          dataKey={yKey}
          stroke="#8884d8"
        />
        <XAxis
          dataKey={xKey}
          tickMargin={7}
          stroke="#6b7280"
          scale="time"
          tickFormatter={(tick) => {
            const date = new Date(tick)
              .toLocaleDateString('en-us')
              .split('/');

            return `${date[0]}/${date[2].substring(2)}`
          }}
        />
        <YAxis
          domain={range}
          interval={0}
          ticks={yTicks}
          tick={isPercentage ? PercentageTick : CustomTick}
        />
        <Tooltip
          wrapperClassName="!bg-slate-200 dark:!bg-gray-800 rounded-lg"
          labelFormatter={(label) => new Date(label).toLocaleDateString('en-us')}
          formatter={(value) => {
            if (isPercentage) {
              return value + '%'
            } else if (isBoolean) {
              return value === 1 ? 'y' : 'n'
            } else {
              return value;
            }
          }}
          cursor={false}
        />
      </LineChart>
    </div>
  )
}

export { Chart, PercentageTick, CustomTick, DateTick };
