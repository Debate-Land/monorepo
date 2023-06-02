import React from 'react';

interface CustomTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
};

export const CustomTick = ({ x, y, payload }: CustomTickProps) => (
  <g transform={`translate(${x},${y})`}>
    <text x={0} y={0} dy={3} textAnchor="end" fill="#666">
      {payload.value}
    </text>
  </g>
);

export const PercentageTick = ({ payload, ...props }: CustomTickProps) => (
  <CustomTick {...props} payload={{ value: payload.value + '%' }} />
);
