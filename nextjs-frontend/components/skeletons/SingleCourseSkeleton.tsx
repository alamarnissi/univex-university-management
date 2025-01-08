import React from 'react'
import { Skeleton } from '../ui/skeleton'

const SingleCourseSkeleton = () => {
    return (
        <div>
            <div className={`flex flex-col items-center justify-between gap-8 mb-5`}>
                <div className='grid grid-cols-1 md:grid-cols-4 gap-5 w-full'>
                    <div className='col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 shadow-md rounded-xl bg-white cursor-pointer gap-4 py-3 px-4'>
                        <Skeleton className="relative col-span-1 w-full h-[168px]" />
                        <div className='col-span-1 md:col-span-2 flex flex-col items-start justify-evenly gap-3 px-2'>
                            <Skeleton className="h-4 w-[250px]" />
                            <div>
                                <Skeleton className="h-3.5 w-[340px] mb-3" />
                                <Skeleton className="h-3.5 w-[340px]" />
                            </div>
                            <div className='flex items-center justify-start gap-5'>
                                <Skeleton className="h-3 w-[140px]" />
                                <Skeleton className="h-3 w-[140px]" />
                            </div>
                        </div>
                    </div>
                    <div className='col-span-1 my-auto'>
                        <div className='flex flex-col w-full gap-4 justify-center'>
                            <Skeleton className='rounded-lg h-10 w-full' />
                            <Skeleton className='rounded-lg h-10 w-full' />
                            <Skeleton className='rounded-lg h-10 w-full' />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Topbar */}
            <div className="flex flex-wrap w-full">
                <div className='w-full'>

                    <div className='grid grid-cols-3 bg-white rounded-xl shadow-md px-4 py-3 mb-5' >
                        <div className="col-span-2 flex mb-0 list-none flex-wrap py-4 flex-row gap-3">
                            <Skeleton className='h-2 w-[100px]' />
                            <Skeleton className='h-2 w-[100px]' />
                            <Skeleton className='h-2 w-[100px]' />
                            <Skeleton className='h-2 w-[100px]' />
                        </div>
                    </div>
                    <div className="relative flex flex-col gap-8 min-w-0 break-words bg-white w-full mb-6 py-8 px-5 shadow-lg rounded">
                        <div className='flex items-start justify-between'>
                            <Skeleton className='h-4 w-[150px]' />
                            <Skeleton className='h-5 w-[180px]' />
                        </div>
                        <Skeleton className='h-6 w-[350px]' />
                        <Skeleton className='h-6 w-[350px]' />
                        <Skeleton className='h-6 w-[350px]' />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleCourseSkeleton