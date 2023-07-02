import React, { useMemo } from "react";
import * as d3 from "d3-array";
import { XAxis, YAxis, Bar, ComposedChart, Line, Label } from "recharts";
import { useTheme } from "next-themes";

interface HistogramProps {
  data: number[];
  dataType: string;
}

const Histogram = ({ data, dataType }: HistogramProps) => {
  const { theme } = useTheme();
  const chartData = useMemo(() => {
    const formattedData: {
      count: number;
      x0: number;
      x1: number;
      range: string;
    }[] = [];
    const bins = d3.bin()(data);
    bins.map((bin) => {
      bin.x0 &&
        bin.x1 &&
        formattedData.push({
          count: bin.length,
          x0: bin.x0,
          x1: bin.x1,
          range: `${bin.x0}-${bin.x1}`,
        });
    });
    return formattedData;
  }, [data]);

  return (
    <div className="w-full mx-auto pr-8 flex flex-col items-center">
      <h3 className="ml-6 mb-2 text-gray-600 dark:text-gray-500">
        {dataType} Distribution
      </h3>
      <ComposedChart
        width={300}
        height={200}
        data={chartData}
        barCategoryGap={3}
        margin={{ top: 10, bottom: 20, right: 30 }}
      >
        <XAxis dataKey="range" hide />
        <XAxis dataKey="x0" xAxisId="values" tickMargin={8}>
          <Label
            position="centerBottom"
            value={dataType}
            dy={25}
            transform="10"
          />
        </XAxis>
        <YAxis>
          <Label
            position="centerTop"
            value="Frequency"
            offset={20}
            dx={-15}
            angle={270}
          />
        </YAxis>
        <Bar
          dataKey="count"
          fill="#8884d8"
          opacity={theme === "dark" ? 1 : 0.75}
          radius={5}
        />
        <Line
          type="monotone"
          dataKey="count"
          strokeWidth={2}
          z={5}
          stroke="#67e8f9"
          opacity={theme === "dark" ? 1 : 0.75}
        />
      </ComposedChart>
    </div>
  );
};

export default Histogram;
