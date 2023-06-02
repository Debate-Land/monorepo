import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { CustomTick, PercentageTick } from './CustomTick';

interface ChartProps<T> {
  title: string;
  data: T[];
  xKey: string & keyof T;
  yKey: string & keyof T;
  isPercentage?: boolean
}

const Chart = <T,>({title, data, xKey, yKey, isPercentage}: ChartProps<T>) => {
  return (
    <div className='w-fit flex flex-col items-center'>
      <h3 className='ml-12 mb-2 text-gray-600 dark:text-gray-500'>{title}</h3>
      <LineChart
        width={300}
        height={200}
        data={data}
        title={title}
        margin={{ top: 5, right: 25, bottom: 5, left: 0 }}
      >
        <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
        <XAxis dataKey={xKey} tickMargin={7}/>
        <YAxis tick={isPercentage ? PercentageTick : CustomTick} />
        <Tooltip
          wrapperClassName="!bg-slate-200 dark:!bg-gray-800 rounded-lg"
          formatter={(value) => isPercentage ? value + '%' : value}
        />
      </LineChart>
    </div>
  )
}

export default Chart