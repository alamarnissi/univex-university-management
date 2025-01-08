"use client"
import React from 'react'
import Image from 'next/image'

import Brain from "@/components/Common/assets/brain.png"
import Stars2 from "@/components/Common/assets/stars2.png"
import { useSingleCourseStore } from '@/stores/useCourseStore'

const SummariesPage = ({ params: { slug } }: { params: { slug: string } }) => {
    const [isFullSummary, setIsFullSummary] = React.useState("")
    const { setCourseSlug } = useSingleCourseStore()

    React.useEffect(() => {
        setCourseSlug(slug)
    }, [])

    return (
        <>
            <div className='w-full flex items-center justify-center gap-3 bg-white border border-[#FF8FA2] rounded-lg px-8 py-6'>
                <Image
                    src={Brain}
                    alt="brain"
                    width={100}
                    height={100}
                />
                <div className='text-center px-4'>
                    <p className='font-semibold '>
                        Great progress! Access the AI generated summaries of key points to review concepts, reinforce learning, and stay on track. Keep up the good work!
                    </p>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-4 bg-white px-5 py-8 rounded-lg mt-5'>
                <div
                    onClick={() => (isFullSummary === "" || isFullSummary !== "1st") ? setIsFullSummary("1st") : setIsFullSummary("")}
                    className={`${isFullSummary !== "" && isFullSummary !== "1st" ? "hidden" : "flex"} relative hover:cursor-pointer w-full items-center justify-between bg-[#F0F7FF] rounded-lg pl-8 py-6 overflow-hidden`}
                >
                    <div className='w-[86%]'>
                        <p className='text-lg font-bold mb-3'>
                            Summary of course 1
                        </p>
                        {isFullSummary === "" ?
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of keyword and scrambled it to make ....
                            </p>
                            : isFullSummary === "1st" ?
                                <>
                                    <p className='font-semibold'>
                                        Module 1
                                    </p>
                                    <p className='mb-3'>
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                    </p>
                                    <p className='font-semibold'>
                                        Module 2
                                    </p>
                                    <p className='mb-3'>
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                    </p>
                                </>
                                :
                                null
                        }

                    </div>
                    <div className='pl-3 absolute top-0 right-0 flex items-start justify-end'>
                        <Image
                            src={Stars2}
                            alt="stars"
                            width={240}
                            height={200}
                            className='-mt-5 -mr-12'
                        />
                    </div>
                </div>

                <div onClick={() => (isFullSummary === "" || isFullSummary !== "2nd") ? setIsFullSummary("2nd") : setIsFullSummary("")}
                    className={`${isFullSummary !== "" && isFullSummary !== "2nd" ? "hidden" : "flex"} relative hover:cursor-pointer w-full items-center justify-between bg-[#F0F7FF] rounded-lg pl-8 py-6 overflow-hidden`}
                >
                    <div className='w-[86%]'>
                        <p className='text-lg font-bold mb-3'>
                            Summary of course 2
                        </p>
                        {isFullSummary === "" ?
                            <p>
                                Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                when an unknown printer took a galley of keyword and scrambled it to make ....
                            </p>
                            : isFullSummary === "2nd" ?
                                <>
                                    <p className='font-semibold'>
                                        Module 1
                                    </p>
                                    <p className='mb-3'>
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                    </p>
                                    <p className='font-semibold'>
                                        Module 2
                                    </p>
                                    <p className='mb-3'>
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                        Lorem Ipsum is simply dummy text of the printing and keyword industry.
                                        Lorem Ipsum has been the industry standard dummy text ever since the 1500s,
                                        when an unknown printer took a galley of keyword and scrambled it to make.
                                    </p>
                                </>
                                :
                                null
                        }
                    </div>
                    <div className='pl-3 absolute top-0 right-0 flex items-start justify-end '>
                        <Image
                            src={Stars2}
                            alt="stars"
                            width={240}
                            height={200}
                            className='-mt-5 -mr-12'
                        />
                    </div>
                </div>
            </div>
        </>
    )
}

export default SummariesPage