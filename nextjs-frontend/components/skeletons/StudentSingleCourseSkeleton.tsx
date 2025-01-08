import React from 'react'
import { Skeleton } from '../ui/skeleton'

const StudentSingleCourseSkeleton = () => {
  return (
    <div className={`flex flex-col items-center justify-between gap-8`}>
      <div className='w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1'>
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-24 h-6" />
      </div>

      <div className='w-full bg-white rounded-xl flex flex-col justify-center gap-8 py-8 px-5'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
          <Skeleton className="w-24 h-3" />
          <div className='order-3 md:order-2 w-full md:w-2/5 flex items-center justify-center gap-3 mt-2'>
            <Skeleton className="w-2 h-2 rounded-full" />
            <Skeleton className="w-48 h-3" />
            <Skeleton className="w-2 h-2 rounded-full" />
          </div>
          <div className='order-2 md:order-3 flex justify-start items-center md:justify-center gap-2'>
            <Skeleton className="w-24 h-3" />
          </div>
        </div>

        <div className='w-full'>
          <Skeleton className="w-full h-[300px]" />
        </div>
      </div>
    </div>
  )
}

export default StudentSingleCourseSkeleton