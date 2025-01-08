import dynamic from "next/dynamic";
import DashboardSkeleton from "../dashboardSkeleton";
import { fetchWSKpis } from "@/lib/fetch/FetchWorkspaces";
import { cookies } from "next/headers";


const ManagerDashboard = dynamic(() => import("./ManagerDashboard"), {
  ssr: false,
  loading: () => <DashboardSkeleton />
});

const InstructorDashboard = dynamic(() => import("./InstructorDashboard"), {
  ssr: false,
  loading: () => <DashboardSkeleton />
});

const StudentDashboard = dynamic(() => import("./StudentDashboard"), {
  ssr: false,
  loading: () => <DashboardSkeleton />
})

const GetDashboard = async ({ role, subdomain }: { role: string, subdomain: string }) => {
  const token = (cookies()?.get("access_token")?.value as string) ?? "";
 
  const manager_kpis = role === "manager" && await fetchWSKpis(subdomain, token);
  
  return (
    <>
      {
        {
          "student": <StudentDashboard />,
          "manager": <ManagerDashboard manager_kpis={manager_kpis?.data} />,
          "instructor": <InstructorDashboard />
        }[role]
      }
    </>
  )
}

export default GetDashboard