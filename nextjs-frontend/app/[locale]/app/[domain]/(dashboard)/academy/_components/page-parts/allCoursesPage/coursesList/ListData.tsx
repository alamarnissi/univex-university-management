"use client"
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FC, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

import Pagination from '@/components/pagination';
import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton';
import CourseCard from "../../../CourseCard";

import { fetchChangeCourseStatus, fetchCourses, fetchDeleteCourse } from '@/lib/fetch/courses/FetchCourses';
import { CourseDisplayType } from '@/lib/types/dataTypes';

import courseImg from "./course.jpg";
import { useToast } from '@/components/ui/toast/use-toast';
import AlertBox from '@/components/Common/AlertBox';

interface Props {
  prefetchedData: any
  setIsActive: (value: string) => void
  sortValue: string
  statusValue: string
  searchValue: string
  role: string
  workspace_subdomain: string
}

const allcourses_url = process.env.NEXT_PUBLIC_COURSES_API_URL + "/v1/courses/list";

const ListData: FC<Props>= ({ prefetchedData, setIsActive, sortValue, statusValue, searchValue, role, workspace_subdomain }) => {
  const { toast } = useToast();
  const { mutate } = useSWRConfig();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = new URLSearchParams(Array.from(searchParams.entries()));
  const statusParam = (searchParams.get("courseStatus") as string) ?? "all";
  const pageParam = (searchParams.get("page") as string) ?? "1";

  const [isLoading, setIsLoading] = useState(false);
  const [prevStatus, setPrevStatus] = useState(statusParam);
  const [currentPage, setCurrentPage] = useState<string | number>(Number(pageParam));

  let perPage = 6;
  const firstPageIndex = (currentPage as number - 1) * perPage;
  const lastPageIndex = firstPageIndex + perPage;

  if (statusParam !== prevStatus) {
    setPrevStatus(statusParam);
    setIsActive(statusParam);
    setCurrentPage(1);
  }

  // Fetch all courses data
  const { data: coursesData } = useSWR(
    [allcourses_url, sortValue, statusValue, searchValue],
    ([url, sortValue, statusValue, searchValue]) => fetchCourses(url, sortValue, statusValue, searchValue),
    { fallbackData: prefetchedData }
  );
  const courses = coursesData?.data?.courses;
  const currentCourseData = courses && courses.slice(firstPageIndex, lastPageIndex);

  const handlePagination = (page: string | number) => {
    setCurrentPage(page);
    params.set("page", page.toString());

    // cast to string
    const search = params.toString();
    const query = search ? `?${search}` : "";

    router?.push(`${pathname}${query}`);
  }

  const handleDelete = async ({ course_slug }: { course_slug: string }) => {
    try {
      setIsLoading(true);
      const response = await fetchDeleteCourse({ course_slug: course_slug as string });

      if (response.status >= 200 && response.status < 300) {
        toast({ variant: "success", description: response.message });
      } else {
        toast({ variant: "destructive", description: response.message });
      }
      mutate([allcourses_url, sortValue, statusValue, searchValue]);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      toast({ variant: "destructive", description: "An Error Has Occurred" });
      return false;
    }
  }

  const handleChangeStatus = async ({ course_slug, course_status }: { course_slug: string, course_status: string }) => {
    try {
      setIsLoading(true);
      const status = course_status === "published" ? "draft" : "published";
      const response = await fetchChangeCourseStatus(course_slug, status);

      if (response.status >= 200 && response.status < 300) {
        toast({ variant: "success", description: response.message });
      } else {
        toast({ variant: "destructive", description: response.message });
      }
      mutate([allcourses_url, sortValue, statusValue, searchValue]);
      setIsLoading(false);
      return true;
    } catch (error) {
      setIsLoading(false);
      toast({ variant: "destructive", description: "An Error Has Occurred" });
      return false;
    }
  }

  if (!currentCourseData) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <CourseCardSkeleton />
        <CourseCardSkeleton />
        <CourseCardSkeleton />
      </div>
    )
  }

  return (
    <>
      {coursesData?.data.total !== 0 ?
        <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
          {currentCourseData.map((data: CourseDisplayType, i: number) => {
            let imagePreview = `${process.env.NEXT_PUBLIC_GCS_URL}${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${data?.promotional_image}`
            return (
              <CourseCard
                handleDelete={handleDelete}
                handleChangeStatus={handleChangeStatus}
                isLoading={isLoading}
                course_id={data?.course_id as string}
                nbrModules={data?.total_modules_number}
                reviews={data?.overall_rating}
                title={data?.course_name}
                slug={data?.slug}
                status={data?.course_status}
                progress={40}
                image={data?.promotional_image !== "" ? imagePreview! : courseImg}
                role={role}
                key={i}
              />
            )
          })}
        </div>
        :
        <AlertBox type='error' message="No courses were found" />
      }
      {courses &&
        <div className='flex items-center justify-center mt-10'>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={coursesData ? coursesData?.data?.total as number : 1}
            // totalCount={currentCourseData?.length as number}
            // totalCount={6}
            limit={perPage}
            onPageChange={handlePagination}
          />
        </div>
      }
    </>
  )
}

export default ListData