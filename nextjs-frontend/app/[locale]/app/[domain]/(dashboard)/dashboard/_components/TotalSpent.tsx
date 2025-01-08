"use client"
import dynamic from "next/dynamic";
import {
  MdOutlineCalendarToday
} from "react-icons/md";
import Card from "@/components/dashboard/card";
import {
  lineChartDataTotalSpent,
  lineChartOptionsTotalSpent,
} from "@/lib/data/charts";
import { useEffect, useState } from "react";

const LineChart = dynamic(() => import("@/components/dashboard/charts/LineChart"), {
  loading: () => <p>loading...</p>,
  ssr: false
})

type lineChartDataType = {
  name: string,
  data: number[],
  color?: string,
}

const TotalSpent = ({ classNames, lineChartData, xaxis_categories }: { classNames?: string, lineChartData: any, xaxis_categories: string[] }) => {
  const [openDurationFilter, setOpenDurationFilter] = useState(false);
  const [durationFilter, setDurationFilter] = useState("Last 3 Months");
  const [openMetricFilter, setOpenMetricFilter] = useState(false);
  const [metricFilter, setMetricFilter] = useState("Sales");

  let lineChartDataByMetric = metricFilter === "Sales" ? lineChartData.sales_kpi : lineChartData.learners_kpi;

  const [latestData, setLatestData] = useState({
    data: { ...lineChartDataByMetric[0], data: lineChartDataByMetric[0].data.slice(-3) },
    xaxis_cat: xaxis_categories
  })

  useEffect(() => {
    switch (durationFilter) {
      case "Last 3 Months":
        setLatestData({ xaxis_cat: xaxis_categories.slice(-3), data: { ...lineChartDataByMetric[0], data: lineChartDataByMetric[0].data.slice(-3) } })
        break;
      case "Last 6 Months":
        setLatestData({ xaxis_cat: xaxis_categories.slice(-6), data: { ...lineChartDataByMetric[0], data: lineChartDataByMetric[0].data.slice(-6) } })
        break;
      case "Last 12 Months":
        setLatestData({ xaxis_cat: xaxis_categories, data: { ...lineChartDataByMetric[0], data: lineChartDataByMetric[0].data } })
        break;

      default:
        break;
    }
  }, [durationFilter, lineChartData, lineChartDataByMetric, xaxis_categories])

  useEffect(() => {
    switch (metricFilter) {
      case "Sales":
        lineChartDataByMetric = lineChartData.sales_kpi;
        break;
      case "Learners":
        lineChartDataByMetric = lineChartData.learners_kpi;
        break;

      default:
        break;
    }
  }, [metricFilter, lineChartData, lineChartDataByMetric])

  return (
    <Card className={`!p-[20px] text-center ${classNames}`}>
      <div className="flex justify-between mb-2">
        <p className="font-semibold capitalize">
          {metricFilter === "Sales" ? 'Earning Overview' : 'Students Overview'}
        </p>
        <div className="flex items-center gap-3 flex-nowrap">
          <div className="relative flex items-center justify-start">
            <button
              onClick={() => {setOpenMetricFilter(!openMetricFilter); setOpenDurationFilter(false); }}
              className="linear mt-1 flex items-center justify-center gap-2 "
            >
              <p>Select a metric</p>
              <span className="text-sm font-medium text-gray-600 text-start rounded-lg bg-lightPrimary p-2 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">{metricFilter === "Sales" ? "Earnings" : "Number of Students"}</span>
            </button>
            <div className={`${openMetricFilter === true ? 'flex' : 'hidden'} flex-col text-start w-fit absolute right-0 top-full gap-2 px-3 py-4 z-50 bg-white rounded-md`}>
              <p onClick={() => { setMetricFilter("Sales"); setOpenMetricFilter(false); }} className=" cursor-pointer text-sm text-gray-700 font-semibold hover:text-gray-700/80">Earnings</p>
              <p onClick={() => { setMetricFilter("Learners"); setOpenMetricFilter(false); }} className=" cursor-pointer text-sm text-gray-700 font-semibold hover:text-gray-700/80">Number of Students</p>
            </div>
          </div>
          <div className="relative flex items-center justify-start">
            <button
              onClick={() => { setOpenDurationFilter(!openDurationFilter); setOpenMetricFilter(false); }}
              className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80"
            >
              <MdOutlineCalendarToday />
              <span className="text-sm font-medium text-gray-600">{durationFilter}</span>
            </button>
            <div className={`${openDurationFilter === true ? 'flex' : 'hidden'} flex-col w-full absolute left-3 top-full gap-2 px-3 py-4 z-50 bg-white rounded-md`}>
              <p onClick={() => { setDurationFilter("Last 3 Months"); setOpenDurationFilter(false); }} className=" cursor-pointer text-sm text-gray-700 font-semibold hover:text-gray-700/80">Last 3 Months</p>
              <p onClick={() => { setDurationFilter("Last 6 Months"); setOpenDurationFilter(false); }} className=" cursor-pointer text-sm text-gray-700 font-semibold hover:text-gray-700/80">Last 6 Months</p>
              <p onClick={() => { setDurationFilter("Last 12 Months"); setOpenDurationFilter(false); }} className=" cursor-pointer text-sm text-gray-700 font-semibold hover:text-gray-700/80">Last 12 Months</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="h-full w-full">
          <LineChart
            // @ts-ignore
            options={{ xaxis: { categories: latestData.xaxis_cat }, ...lineChartOptionsTotalSpent }}
            series={[latestData.data] || []}
            classNames="h-full"
          />
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
