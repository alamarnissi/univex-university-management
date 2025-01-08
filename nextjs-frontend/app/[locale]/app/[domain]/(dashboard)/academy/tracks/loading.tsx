import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const TracksLoading = () => {
    return (
        <div>
            <div className={"flex justify-between items-start md:items-center flex-col md:flex-row"}>
                <Skeleton className='w-[150px] h-[30px]'></Skeleton>

                <Skeleton className='w-[150px] h-[30px]'></Skeleton>
            </div>

            <div className={"flex justify-between items-start md:items-center flex-col md:flex-row my-4"}>
                <div className='flex items-center gap-5 py-4'>
                    <Skeleton className='w-[100px] h-[20px]'></Skeleton>
                </div>
                <div className={`flex items-start md:items-center gap-5 flex-col-reverse md:flex-row py-4 w-full md:w-auto`} >
                    <Skeleton className='w-[100px] h-[20px]'></Skeleton>
                    <Skeleton className='w-[150px] h-[30px]'></Skeleton>
                    <Skeleton className='w-[150px] h-[30px]'></Skeleton>
                </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                {[1, 2, 3].map(el => (
                    <CourseCardSkeleton key={el} />
                ))}
            </div>
        </div>
    )
}

export default TracksLoading