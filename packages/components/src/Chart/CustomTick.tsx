import React from 'react';

interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
  [key: string]: any
};

export const CustomTick = ({ x, y, payload, ...props }: CustomTickProps) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={3} {...props} textAnchor="end" fill="#6b7280">
      {payload.value}
    </text>
  </g>
);

export const DateTick = ({ payload, ...props }: CustomTickProps) => {
  const date = new Date(payload.value)
    .toLocaleDateString('en-us')
    .split('/');

  return (
    <CustomTick {...props} dx={35} dy={8} payload={{ value: `${date[0]}/${date[2].substring(2)}` }} />
  );
}

export const PercentageTick = ({ payload, ...props }: CustomTickProps) => (
  <CustomTick {...props} payload={{ value: payload.value + '%' }} />
);
