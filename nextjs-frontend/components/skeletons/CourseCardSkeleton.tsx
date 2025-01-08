import { Skeleton } from "@/components/ui/skeleton"

const CourseCardSkeleton = () => {
  return (
    <div className={`flex flex-col w-full min-h-[340px] h-fit space-y-4 !pb-4 3xl:pb-![18px]`}>
      <Skeleton className="w-full h-[168px] rounded-t-xl mb-3" />
      <div className="space-y-3 mb-4">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
      <div className="flex space-x-4">
        <Skeleton className="w-[50px] h-[50px] rounded-full" />
        <div className="flex flex-col justify-center gap-3">
            <Skeleton className="h-3 w-[120px]" />
            <Skeleton className="h-3 w-[120px]" />

        </div>
      </div>
    </div>
  )
}

export default CourseCardSkeleton