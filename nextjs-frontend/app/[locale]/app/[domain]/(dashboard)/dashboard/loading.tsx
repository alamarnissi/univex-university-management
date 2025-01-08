import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const loading = () => {
    return (
        <>
            <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-4 3xl:grid-cols-4">
                <Skeleton className='rounded-[20px] h-[90px] w-auto' />
                <Skeleton className='rounded-[20px] h-[90px] w-auto' />
                <Skeleton className='rounded-[20px] h-[90px] w-auto' />
                <Skeleton className='rounded-[20px] h-[90px] w-auto' />
            </div>
            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
                <Skeleton className='md:col-span-2 h-[250px] w-auto rounded-[20px]' />
                <Skeleton className='md:col-span-1 h-[250px] w-auto rounded-[20px] place-content-center' />
            </div>
        </>
    )
}

export default loading