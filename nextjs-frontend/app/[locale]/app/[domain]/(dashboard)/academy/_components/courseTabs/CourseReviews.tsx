
import ReviewCard from '../ReviewCard'

const CourseReviews = () => {
    return (
        <div className='flex flex-col justify-center gap-5 w-full my-4'>
            <div className='flex items-center justify-start'>
                <p className='font-semibold text-xl dark:text-white'>What participants think about your course ?</p>
            </div>
            <div className='flex flex-col items-start justify-center gap-5'>
                <p className='text-gray-400 font-medium'>All Reviews</p>
                <div className='flex flex-col items-start justify-center gap-4 w-full'>
                    <ReviewCard />
                    <ReviewCard />
                </div>
            </div>

        </div>
    )
}

export default CourseReviews