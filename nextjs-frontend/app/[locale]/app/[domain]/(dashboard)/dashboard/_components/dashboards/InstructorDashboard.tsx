import dynamic from 'next/dynamic'
import { CoursesIcon, InstructorsIcon, PaymentSetupIcon, StudentsIcon } from '@/components/Common/assets/sidebarIcons'
import {
    lineChartDataTotalSpent,
  } from "@/lib/data/charts";

const MiniCalendar = dynamic(() => import("@/components/dashboard/calendar/MiniCalendar"), {
    loading: () => <p>loading...</p>,
    ssr: false
})

const Widget = dynamic(() => import('@/components/dashboard/widget'), {
    ssr: false
})

const ListWidget = dynamic(() => import('@/components/dashboard/widget/ListWidget'), {
    ssr: false
})

const TotalSpent = dynamic(() => import('../TotalSpent'), {
    ssr: false
})
const InstructorDashboard = () => {
  return (
    <>
          {/* Card widget */}
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4">
              <Widget
                  icon={<PaymentSetupIcon className="h-6 w-6" />}
                  title={"Total Sales"}
                  value={"DT 5.320"}
                  valDiff='+0.68%'
                  diffIsPositive={true}
              />
              <Widget
                  icon={<StudentsIcon className="h-6 w-6 text-[#D9186C]" />}
                  iconBg='bg-red-100/40'
                  title={"Total Learners"}
                  value={"99"}
                  valDiff='+2'
                  diffIsPositive={true}
              />
              <Widget
                  icon={<InstructorsIcon className="h-6 w-6 text-[#17D2B1]" />}
                  iconBg='bg-green-100/40'
                  title={"Active Learners"}
                  value={"68"}
                  valDiff={"-10"}
                  diffIsPositive={false}
              />
              <Widget
                  icon={<CoursesIcon className="h-6 w-6 text-[#EAA451]" />}
                  iconBg='bg-orange-100/40'
                  title={"Satisfaction Rate"}
                  value={"72%"}
                  valDiff={"-14%"}
                  diffIsPositive={false}
              />
          </div>

          {/* Charts */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <TotalSpent lineChartData={{"sales_kpi": lineChartDataTotalSpent}} xaxis_categories={["SEP", "OCT", "NOV", "DEC", "JAN", "FEB"]} classNames='md:col-span-2' />
              <MiniCalendar classNames='md:col-span-1 place-content-center' />
          </div>

          <div className={"mt-5 grid grid-cols-1 gap-4 md:grid-cols-3"}>
            <ListWidget />
            <ListWidget />
            <ListWidget />
          </div>
      </>
  )
}

export default InstructorDashboard;