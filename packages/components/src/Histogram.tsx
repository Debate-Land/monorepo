import React, { useMemo } from "react";
import * as d3 from "d3-array";
import { BarChart, XAxis, YAxis, Bar } from "recharts";
import { useTheme } from "next-themes";

interface HistogramProps {
  data: number[];
  title: string;
}

const Histogram = ({ data, title }: HistogramProps) => {
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
      <h3 className="ml-12 mb-2 text-gray-600 dark:text-gray-500">{title}</h3>
      <BarChart
        width={300}
        height={200}
        data={chartData}
        barCategoryGap={3}
        margin={{ top: 10, bottom: 10, right: 30 }}
      >
        <XAxis dataKey="range" hide />
        <XAxis dataKey="x0" xAxisId="values" tickMargin={8} />
        <YAxis />
        <Bar
          dataKey="count"
          fill="#8884d8"
          opacity={theme === "dark" ? 1 : 0.75}
          radius={5}
        />
      </BarChart>
    </div>
  );
};

export default Histogram;
