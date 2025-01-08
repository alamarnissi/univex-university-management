"use client"
import Image from 'next/image'
import { useState } from 'react'
import { useCurrentUserState } from '@/stores/useGlobalStore'
import { BsArrowRightCircle, BsXCircle } from 'react-icons/bs'

// images
import userImg from "@/components/Common/assets/user.png"
import FillStar from '@/components/Common/assets/FillStar'
import OutlineStar from '@/components/Common/assets/OutlineStar'

const ReviewCard = ({ hasReview = false }) => {
    const { currentUser } = useCurrentUserState();
    const [isCommenting, setIsCommenting] = useState(false);
    const [comments, setComments] = useState([
        {
            msg: "",
            name: currentUser?.username
        }
    ])

    return (
        <div className='max-w-full shadow-lg rounded-lg flex flex-col gap-3 justify-center py-5 px-6 dark:bg-navy-700'>
            <div className='flex justify-between items-center'>
                <div className="flex items-center justify-start gap-5">
                    <div
                        className="z-10 -mr-3 h-12 w-12 relative rounded-full border-2 border-white dark:!border-navy-800"
                    >
                        <Image
                            className="h-full w-full rounded-full object-cover dark:contrast-0"
                            src={userImg}
                            alt="student"
                            fill
                        />
                    </div>
                    <div className="flex flex-col items-start gap-1 ml-1">
                        <p className="text-sm font-semibold dark:text-white">
                            Tony Danza{" "}
                        </p>
                        <p className='text-gray-400 text-sm dark:text-gray-700'>
                            4 days ago
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <FillStar />
                    <FillStar />
                    <FillStar />
                    <FillStar />
                    <OutlineStar />
                </div>
            </div>
            <div>
                <p className='text-gray-400'>
                    “Our members are so impressed. It&apos;s intuitive. It&apos;s clean. It&apos;s distraction free. If you&apos;re building a community, “Our members are so impressed. It&apos;s intuitive. It&apos;s clean. It&apos;s distraction free. If you&apos;re building a community,
                </p>
            </div>
            <div className='text-right'>
                {isCommenting ?
                    <div className='flex items-center justify-between gap-2 ml-0 md:ml-8 mt-2 bg-gray-200 rounded-lg px-3 py-3 md:py-2'>
                        <div
                            className="hidden md:block z-10 h-10 w-10 mr-2 relative rounded-full border-2 border-white dark:!border-navy-800"
                        >
                            <Image
                                className="h-full w-full rounded-full object-cover"
                                src={userImg}
                                alt="student"
                                fill
                            />
                        </div>
                        <input
                            type='text'
                            placeholder='Write your answer here'
                            className='border-0 bg-transparent placeholder:text-gray-500 dark:text-black flex-1 outline-none'
                        />
                        <div className='text-center m-auto cursor-pointer'>
                            <BsArrowRightCircle size={24} className='text-pink-700 hover:text-pink-700/80' />
                        </div>
                        <div className='text-center m-auto cursor-pointer'>
                            <BsXCircle
                                size={24}
                                className='text-gray-700 hover:text-gray-700/80'
                                onClick={() => setIsCommenting(false)}
                            />
                        </div>
                    </div>

                    :

                    <button
                        type='button'
                        onClick={() => setIsCommenting(true)}
                        className='text-pink-700 font-semibold hover:text-pink-700/80'>
                        Reply
                    </button>
                }
            </div>
        </div>
    )
}

export default ReviewCard