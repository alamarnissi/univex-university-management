import dynamic from 'next/dynamic'
import { CoursesIcon, InstructorsIcon, PaymentSetupIcon, StudentsIcon } from '@/components/Common/assets/sidebarIcons'
import { lessActiveLearnersData, topActiveLearnersData } from '@/lib/data/dummyDataCourses'

const MiniCalendar = dynamic(() => import("@/components/dashboard/calendar/MiniCalendar"), {
    loading: () => <p>loading...</p>,
    ssr: false
})
const Widget = dynamic(() => import('@/components/dashboard/widget'), {
    ssr: false
})

const UsersListWidget = dynamic(() => import('@/components/dashboard/widget/UsersListWidgets'), {
    ssr: false
})

const CoursesListWidget = dynamic(() => import('@/components/dashboard/widget/CoursesListWidget'), {
    ssr: false
})

const TotalSpent = dynamic(() => import('../TotalSpent'), {
    ssr: false
})

const ManagerDashboard = ({ manager_kpis }: { manager_kpis: any }) => {
    const { sales_kpi, popular_courses, learners_kpi, sales_over_time, students_over_time } = manager_kpis;
    
    const over_time_data = {
        "sales_kpi": [{name: "Sales", data: sales_over_time?.data, color: "#4318FF"}],
        "learners_kpi": [{name: "Students", data: students_over_time?.data, color: "#4318FF"}]
    }
  return (
    <>
          {/* Card widget */}
          <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4">
              <Widget
                  icon={<PaymentSetupIcon className="h-6 w-6" />}
                  title={"Total Sales"}
                  value={`DT ${sales_kpi?.current_month_sales}`}
                  valDiff={`${sales_kpi?.sales_diff}%`}
                  diffIsPositive={sales_kpi?.sales_diff < 0 ? false : true}
              />
              <Widget
                  icon={<StudentsIcon className="h-6 w-6 text-[#D9186C]" />}
                  iconBg='bg-red-100/40'
                  title={"Total Learners"}
                  value={learners_kpi.total_learners}
                  valDiff={`+${learners_kpi.learners_diff}`}
                  diffIsPositive={true}
              />
              <Widget
                  icon={<InstructorsIcon className="h-6 w-6 text-[#17D2B1]" />}
                  iconBg='bg-green-100/40'
                  title={"Active Learners"}
                  value={"520"}
                  valDiff={"-50"}
                  diffIsPositive={false}
              />
              <Widget
                  icon={<CoursesIcon className="h-6 w-6 text-[#EAA451]" />}
                  iconBg='bg-orange-100/40'
                  title={"Satisfaction Rate"}
                  value={"80%"}
                  valDiff={"-10%"}
                  diffIsPositive={false}
              />
          </div>

          {/* Charts */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
              <TotalSpent lineChartData={over_time_data || {}} xaxis_categories={sales_over_time?.months} classNames='md:col-span-2' />
              <MiniCalendar classNames='md:col-span-1 place-content-center' />
          </div>

          <div className={"mt-5 grid grid-cols-1 gap-4 md:grid-cols-3"}>
            <CoursesListWidget coursesData={popular_courses} />
            <UsersListWidget usersData={topActiveLearnersData} widgetTitle={"Top active learners"} />
            <UsersListWidget usersData={lessActiveLearnersData} widgetTitle={"Less active learners"} />
          </div>  
      </>
  )
}

export default ManagerDashboard;