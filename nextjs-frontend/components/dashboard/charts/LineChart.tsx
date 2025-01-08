'use client'

import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";

type Props = {
  series: ApexAxisChartSeries | any
  options: ApexOptions
  type?: "area" | "line" | "bar" | "candlestick" | "pie" | "donut" 
  classNames?: string
}

const LineChart = (props: Props) => {
  const { series, classNames, options, type } = props;

  return (
    <div className={`${classNames}`}>
      <Chart
        options={options}
        type={ type || "line"}
        width="100%"
        height="100%"
        series={series}
      />
    </div>
  );
};

export default LineChart;
