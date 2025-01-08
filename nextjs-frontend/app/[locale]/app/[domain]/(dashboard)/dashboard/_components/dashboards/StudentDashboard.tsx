"use client"
import { CompleteProfile } from "./studentDashboard-parts/CompleteProfile"
import { ProgressWidgets } from "./studentDashboard-parts/ProgressWidgets"
import { TopHeader } from "./studentDashboard-parts/TopHeader"

import LineChart from "@/components/dashboard/charts/LineChart"
import { UserInfoCard } from "./studentDashboard-parts/UserInfoCard"

import Badge from "@/components/Common/assets/Badge.png"
import Image from "next/image"
import { Progress } from "@/components/ui/progress"
import dynamic from "next/dynamic"
import ListWidget from "@/components/dashboard/widget/ListWidget"
import { MoveUpRight, PlusIcon } from "lucide-react"
import { ProgressLineChart } from "./studentDashboard-parts/ProgressLineChart"
import { Calendar } from "lucide-react"
import { BsCircleFill } from "react-icons/bs"

const MiniCalendar = dynamic(() => import("@/components/dashboard/calendar/MiniCalendar"), {
  loading: () => <p>loading...</p>,
  ssr: false
})

const StudentDashboard = () => {
  return (
    <>
      <TopHeader />

      <div className="mt-3 grid h-full grid-cols-1 gap-5 lg:grid-cols-12 2xl:grid-cols-12 lg:overflow-x-scroll xl:overflow-x-hidden">
        <div className="order-2 lg:order-1 col-span-1 h-fit w-full lg:col-span-9 2xl:col-span-9">
          <CompleteProfile />
          <ProgressWidgets />

          <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12 mt-5">
            <div className="col-span-5 lg:col-span-8 lg:mb-0 3xl:col-span-6 p-3 h-fit lg:h-[350px] bg-white rounded-lg">

              <ProgressLineChart />
            </div>
            <div className="col-span-5 lg:col-span-4 lg:mb-0 3xl:col-span-3 flex flex-col gap-4 bg-white h-fit lg:h-[350px] rounded-lg">
              <div className="flex items-center justify-between gap-4 p-3">
                <p className="text-sm font-bold text-navy-700 dark:text-white">
                  Time Taken to finish courses
                  <span className="text-gray-400">{` (Days)`}</span>
                </p>
                <MoveUpRight size={24} className="text-primary" />
              </div>
              <LineChart
                type="bar"
                series={[
                  {
                    name: 'Web Development Course',
                    data: [7, 4, 5, 3.5]
                  },
                  {
                    name: 'Data Science Course',
                    data: [4, 8, 6.5, 10]
                  }
                ]} options={{
                  chart: {
                    type: 'bar',
                    height: "100%",
                    stacked: true,
                    toolbar: {
                      show: false
                    },
                  },
                  responsive: [{
                    breakpoint: 480,
                    options: {
                      legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0
                      }
                    }
                  }],
                  plotOptions: {
                    bar: {
                      horizontal: false,
                      borderRadius: 2,
                      borderRadiusApplication: 'end', // 'around', 'end'
                      borderRadiusWhenStacked: 'last', // 'all', 'last'
                      dataLabels: {
                        total: {
                          enabled: true,
                          style: {
                            fontSize: '13px',
                            fontWeight: 900
                          }
                        }
                      }
                    },
                  },
                  legend: {
                    show: false
                  },
                  xaxis: {
                    type: "category",
                    categories: ["Week 1", "Week 2", "Week 3", "Week 4"]
                  },
                  fill: {
                    opacity: 1
                  }
                }} classNames='h-full place-content-center' />
            </div>
            <div className="col-span-5 lg:col-span-12 lg:mb-0 3xl:!col-span-3">
              <ListWidget
                widgetTitle="Courses"
                showProgressBar={true}
                showDateInfo={false}
                imgHeight={200}
                imgWidth={250}
                isRatioAuto={true}
              />
            </div>
          </div>

          <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12 mt-5">
            <div className="col-span-5 lg:col-span-7 lg:mb-0 3xl:col-span-5 bg-white rounded-lg p-5">
              <p className="text-lg font-bold text-navy-700 dark:text-white mb-2">
                Timeline
              </p>
              <hr />
              <div className="flex items-start justify-start gap-3 mt-5">
                <Calendar size={24} className="text-[#D9186C]" />
                <div className="flex flex-col justify-center gap-3">
                  <p className="text-sm text-[#D9186C]">
                    Saturday, 10 Mai 2022
                  </p>
                  <p className="text-sm">
                    What do you think about course should be completed ?
                    <br />
                    <span className="text-gray-400">15:45</span>
                  </p>
                  <p className="text-sm">
                    What do you think about course should be completed ?
                    <br />
                    <span className="text-gray-400">15:45</span>
                  </p>
                  <p className="inline-flex items-center gap-1 cursor-pointer text-sm text-[#6C63FF]">
                    <PlusIcon size={20} />
                    <span className="underline">
                      Add Submission
                    </span>
                  </p>
                </div>
              </div>

            </div>
            <div className="col-span-5 lg:col-span-5 lg:mb-0 3xl:col-span-4 bg-white rounded-lg p-5">
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold text-navy-700 dark:text-white mb-2">
                  Notifications
                </p>
                <p className="inline-flex items-center gap-1 cursor-pointer text-sm text-[#6C63FF]">
                  <span className="underline">
                    View All
                  </span>
                </p>
              </div>
              <div className="flex flex-col justify-center gap-4 mt-5">
                <div>
                  <p className="flex justify-between gap-3">
                    You have Ui course after 15 min
                    <BsCircleFill size={10} className="text-[#EAA451]" />
                  </p>
                  <p className="w-full text-sm text-right text-gray-400">
                    2 min ago
                  </p>
                </div>
                <div>
                  <p className="flex justify-between gap-3">
                    Complete your profile
                    <BsCircleFill size={10} className="text-[#EAA451]" />
                  </p>
                  <p className="w-full text-sm text-right text-gray-400">
                    4 days ago
                  </p>
                </div>
                <div>
                  <p className="flex justify-between gap-3">
                    Complete your profile
                    <BsCircleFill size={10} className="text-[#EAA451]" />
                  </p>
                  <p className="w-full text-sm text-right text-gray-400">
                    7 days ago
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2 col-span-1 h-full w-full rounded-xl lg:col-span-3 2xl:col-span-3 flex flex-col gap-5">
          <UserInfoCard />

          <div className="flex flex-col items-start justify-center gap-4 rounded-lg bg-white px-4 py-8">
            <p className="capitalize text-lg font-bold text-navy-700 dark:text-white">Latest Badge</p>
            <Image
              src={Badge}
              alt="badge"
              width={"92"}
              height={"30"}
            />
            <Progress value={30} className="h-1 bg-gray-100" />
          </div>

          <MiniCalendar classNames='place-content-center' />
        </div>
      </div>
    </>
  )
}

export default StudentDashboard;