

import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import { Suspense } from 'react';
import { getCoursesData } from '@/lib/fetch/courses/get-courses';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import AllCoursesControls from './_components/page-parts/allCoursesPage/AllCoursesControls';
import CoursesList from './_components/page-parts/allCoursesPage/coursesList/CoursesList';
import AlertBox from '@/components/Common/AlertBox';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

const Header = dynamic(() => import('./_components/page-parts/allCoursesPage/Header'), { ssr: false })
const CourseFormModal = dynamic(() => import('./_components/page-parts/allCoursesPage/CourseFormModal'), { ssr: false })


export default async function Academy({ params: { locale, domain }}: { params: { locale: string, domain: string } }) {
  const session = await getServerSession(authOptions);

  const token = (cookies()?.get("access_token")?.value as string) ?? "";
  const role = (session?.user?.role as string) || "";

  const coursesData = await getCoursesData({ token });

  return (
    <div id='allcourses'>
      <Header role={role} />

      {/* Show All Courses */}
      <Suspense fallback={
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {[1, 2, 3].map(el => (
            <CourseCardSkeleton key={el} />
          ))}
        </div>
      }>
        {coursesData?.data?.total !== 0 ?
          <>
            <AllCoursesControls role={role} />

            <CoursesList 
              coursesData={coursesData} 
              role={role}
              workspace_subdomain={domain}
            />
          </>
          :
          <AlertBox type='error' message='No courses found' />
        }
      </Suspense>


      <CourseFormModal />
    </div>
  )
}
