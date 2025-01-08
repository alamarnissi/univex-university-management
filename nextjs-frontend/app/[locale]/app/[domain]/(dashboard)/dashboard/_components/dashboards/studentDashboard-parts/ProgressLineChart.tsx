import LineChart from '@/components/dashboard/charts/LineChart'
import React from 'react'

export const ProgressLineChart = () => {
  const [series, setSeries] = React.useState([{
    name: "Hours",
    data: [10, 41, 35, 51, 49, 62, 69]
  }]);
  const [progressOptions, setProgressOptions] = React.useState({
    chart: {
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Your Progress',
      align: 'left'
    },
    grid: {
      row: {
        colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
        opacity: 0.5
      },
    },
    xaxis: {
      categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    }
  })
  return (
    <div className="h-full w-full lg:h-[350px]">
      <LineChart
        // @ts-ignore
        options={progressOptions}
        series={series}
        classNames='min-h-fit lg:min-h-[320px]'
        width="100%"
        height="100%"
      />
    </div>
  )
}
