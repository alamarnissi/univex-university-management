import CourseCardSkeleton from '@/components/skeletons/CourseCardSkeleton'
import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const AllCoursesPageSkeleton = () => {
    return (
        <div className='flex flex-col gap-5 w-full'>
            <div className='w-full flex justify-between items-start md:items-center flex-col md:flex-row'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-8 w-[200px]' />
            </div>

            <div className='flex justify-between items-start md:items-center flex-col md:flex-row my-4'>
                <div className='flex items-center gap-5 py-4'>
                    <Skeleton className='h-3 w-[140px]' />
                    <Skeleton className='h-3 w-[140px]' />
                    <Skeleton className='h-3 w-[140px]' />
                </div>
                <div className={`flex items-start md:items-center gap-5 flex-col md:flex-row py-4 w-full md:w-auto`} >
                    <Skeleton className='h-5 w-[200px]' />
                    <Skeleton className='h-5 w-[200px]' />
                </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                <CourseCardSkeleton />
                <CourseCardSkeleton />
                <CourseCardSkeleton />
            </div>
        </div>
    )
}

export default AllCoursesPageSkeleton