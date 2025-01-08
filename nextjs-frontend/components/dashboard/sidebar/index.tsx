'use client'

import { FC, useMemo } from 'react'
import { useCollapsedSidebar } from '@/stores/useGlobalStore';
import { useSidebarContext } from '@/components/providers/SidebarProvider';
import useMobileView from '@/lib/hooks/useMobileView';
import { routes, studentSingleCourseRoutes } from '@/lib/data/dashboardRoutes';
import Links from "./components/Links";
import { HiX } from "react-icons/hi";
import StudentSingleCourseSidebarLinks from './components/StudentSingleCourseLinks';
import { usePathname } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { setFirstLetterOfString } from '@/lib/hooks/setFirstLetterOfString';


type Props = {
  role: string
  subdomain: string
  workspace_name: string
}

const Sidebar: FC<Props> = ({ role, subdomain, workspace_name }) => {
  const { isMobile } = useMobileView()
  const { openSidebar, isCollapsedState, setOpenSidebar } = useSidebarContext()

  // const { isStudentSingleCourse, setIsStudentSingleCourse } = useDashboardSidebarStore()
  const { setIsCollapsedState } = useCollapsedSidebar();

  const pathname = usePathname()

  const isStudentRoutes = pathname.includes('/academy/courses');
  const shortWorkspaceName = setFirstLetterOfString(workspace_name);

  const filterRoutesByRole = (routes: any, userRole: string) => {
    return routes.filter((route: any) => {
      const matchesRole = route.hasRole ? route.hasRole.includes(userRole) : true;

      if (matchesRole && route.hasChild) {
        route.children = route.children.filter((child: any) => {
          return child.hasRole ? child.hasRole.includes(userRole) : true;
        });
      }

      return matchesRole;
    });
  };

  const activeRoutes = useMemo(() => {
    return filterRoutesByRole(routes, role)
  }, [routes, role]);

  return (
    <>
      <div className={`bg-[#000] bg-opacity-70 absolute inset-0 z-50 ${openSidebar && isMobile ? 'block w-screen h-full' : 'hidden'}`} onClick={() => setOpenSidebar(false)} />

      <div
        className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 
        ${openSidebar ? "translate-x-0" : "-translate-x-96"}`}
      >
        <span className="absolute top-4 right-4 block cursor-pointer xl:hidden" onClick={() => setOpenSidebar(false)} >
          <HiX />
        </span>

        <div className={`${isCollapsedState ? `-right-[40px]` : `right-2`} absolute top-2 hidden xl:block cursor-pointer`}>
          <button
            type="button"
            onClick={() => setIsCollapsedState(!isCollapsedState)}
            className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          >
            <span className="sr-only">Open sidebar</span>
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
            </svg>
          </button>
        </div>

        <div className={`${isCollapsedState ? `ml-6` : `mx-[56px]`} mt-[50px] mb-2 flex items-start max-w-[170px] text-center`}>
          <div className="mt-1 ml-1 h-2.5 font-poppins text-xl font-bold uppercase text-navy-700 dark:text-white whitespace-pre-wrap">
            {isCollapsedState ? shortWorkspaceName : workspace_name}
            {/* <span className={`${isCollapsedState ? `hidden` : `inline-block`} font-medium`}>Academy</span> */}
          </div>
        </div>

        <div className={`mt-[48px] mb-7 h-px bg-gray-300 dark:bg-white/30`} />

        {/* Nav item */}
        <ul className={`${isCollapsedState ? `w-fit` : ``} ${isStudentRoutes && "overflow-y-scroll no-scrollbar md:h-[560px] pb-[100px]"} mb-auto pt-1`}>
          {(role === "student" && isStudentRoutes) ?
            <>
              <div className='text-left p-4'>
                <Link
                  href={`/academy`}
                  className='flex items-center justify-center w-5 h-5 rounded-full bg-navy-700 '
                >
                  <ChevronLeft size={17} className="text-white -ml-0.5" />
                </Link>

              </div>
              <StudentSingleCourseSidebarLinks
                onClickRoute={isMobile ? () => setOpenSidebar(false) : undefined}
                isCollapsed={isCollapsedState}
                setIsCollapsed={setIsCollapsedState}
                routes={studentSingleCourseRoutes}
                role={role}
              />
            </>
            :
            <Links
              onClickRoute={isMobile ? () => setOpenSidebar(false) : undefined}
              isCollapsed={isCollapsedState}
              subdomain={subdomain}
              routes={activeRoutes}
              role={role}
            />
          }
        </ul>

        {/* Nav item end */}
      </div>
    </>
  );
};

export default Sidebar;
