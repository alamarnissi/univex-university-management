import InstructorSkeleton from '@/components/skeletons/ListSkeleton'
import { Skeleton } from '@/components/ui/skeleton'

const InstructorsPageSkeleton = () => {
    return (
        <div className='flex flex-col gap-8 w-full'>
            <div className='w-full flex justify-between items-start md:items-center flex-col md:flex-row'>
                <Skeleton className='h-4 w-[200px]' />
                <Skeleton className='h-8 w-[200px]' />
            </div>

            <div className='w-full flex flex-col justify-center gap-3'>
                <InstructorSkeleton />
                <InstructorSkeleton />
                <InstructorSkeleton />
            </div>
        </div>
    )
}

export default InstructorsPageSkeleton