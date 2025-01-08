"use client"

import { tracksList } from "@/lib/data/dummyDataCourses";
import { TrackDisplayType } from "@/lib/types/dataTypes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import TrackCard from "../../../TrackCard";

import courseImg from "../../allCoursesPage/coursesList/course.jpg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import Pagination from "@/components/pagination";

const ListData = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const pageParam = (searchParams.get("page") as string) ?? "1";

    const [currentPage, setCurrentPage] = useState<string | number>(Number(pageParam));

    let perPage = 6;
    const firstPageIndex = (currentPage as number - 1) * perPage;
    const lastPageIndex = firstPageIndex + perPage;

    const currentTracksData = tracksList.slice(firstPageIndex, lastPageIndex);


    const handlePagination = (page: string | number) => {
        setCurrentPage(page);
        params.set("page", page.toString());

        // cast to string
        const search = params.toString();
        const query = search ? `?${search}` : "";

        router?.push(`${pathname}${query}`);
    }
    return (
        <>
            <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
                {currentTracksData ? currentTracksData.map((data: TrackDisplayType, i: number) => {
                    return (
                        <TrackCard
                            title={data?.track_name as string}
                            date={data?.created_at as string}
                            image={courseImg}
                            key={i}
                        />
                    )
                }) :

                    <Alert variant="destructive" className='col-span-2'>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Sorry</AlertTitle>
                        <AlertDescription>
                            No Tracks Found
                        </AlertDescription>
                    </Alert>

                }
            </div>
            {currentTracksData &&
                <div className='flex items-center justify-center mt-10'>
                    <Pagination
                        className="pagination-bar"
                        currentPage={currentPage}
                        totalCount={currentTracksData ? tracksList.length as number : 1}
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