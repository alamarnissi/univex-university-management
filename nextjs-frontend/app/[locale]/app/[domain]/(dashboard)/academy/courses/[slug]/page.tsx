
import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import SingleCoursePage from '../../_pages/SingleCoursePage';
import StudentSingleCoursePage from '../../_pages/StudentSingleCoursePage';
import { getInstructorsData } from '@/lib/fetch/instructors/get-instructors';
import { getSingleCoursesData } from '@/lib/fetch/courses/get-single-course';
import StudentSingleCourseSkeleton from '@/components/skeletons/StudentSingleCourseSkeleton';
import SingleCourseSkeleton from '@/components/skeletons/SingleCourseSkeleton';


const SingleCourse = async ({ params: { slug } }: { params: { slug: string } }) => {
    const token = (cookies()?.get("access_token")?.value as string) ?? "";
    const session = await getServerSession(authOptions);

    const role = (session?.user?.role as string) || "";
    const subdomain = (session?.user?.workspace_id as string) || "";

    const singleCourseData = await getSingleCoursesData({ token, slug });
    const allInstructorsData = await getInstructorsData({ token });

    return (
        <>
            {
                role === "student" ?
                    <Suspense fallback={<StudentSingleCourseSkeleton />}>
                        <StudentSingleCoursePage
                            role={role}
                            slug={slug}
                            prefetchedData={singleCourseData}
                        />
                    </Suspense>
                    :
                    <Suspense fallback={<SingleCourseSkeleton />}>
                        <SingleCoursePage
                            role={role}
                            slug={slug}
                            subdomain={subdomain}
                            prefetchedData={singleCourseData}
                            allInstructors={allInstructorsData?.data?.instructors}
                        />
                    </Suspense>
            }
        </>
    )
}

export default SingleCourse