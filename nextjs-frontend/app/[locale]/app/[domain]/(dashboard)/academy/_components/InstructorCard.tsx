"use client"
import { useState } from 'react'
import Image from 'next/image'
import { InstructorType } from '@/lib/types/dataTypes'
import { IoRemoveCircleOutline } from 'react-icons/io5'
import { MdEditNote } from 'react-icons/md'

// images
import instructorImg from "@/components/Common/assets/instructor1.png"
import { fetchRemoveInstructorFromCourse } from '@/lib/fetch/courses/FetchCourses'
import { useToast } from '@/components/ui/toast/use-toast'
import { useSWRConfig } from 'swr'
import Dropdown from '@/components/dashboard/dropdown'

const InstructorCard = ({ instructor, course_slug, role }: { instructor: InstructorType, course_slug: string, role: string }) => {
    const { toast } = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const { mutate } = useSWRConfig()

    const handleRemoveInstructorFromCourse = async ({ instructor_id, course_slug }: { instructor_id: string, course_slug: string }) => {
        try {
            setIsLoading(true);
            const response = await fetchRemoveInstructorFromCourse({ instructor, course_slug });

            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: response.message });
                    mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`)
                } else {
                    toast({ variant: "destructive", description: response.message });
                }
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    }

    return (

        <div className='relative flex flex-col gap-3 justify-center w-full h-full p-4 rounded-xl shadow-xl cursor-pointer hover:bg-gray-100/20 dark:!bg-navy-700 dark:text-white'>
            <div className='relative h-[160px] w-full '>
                <Image
                    src={instructor.profile_image as string || instructorImg}
                    alt='instructor image'
                    fill
                    className='rounded-xl object-cover'
                />
                {role === "manager" &&
                    <div className="absolute right-1 px-2 pt-2">
                        <Dropdown
                            button={
                                <button
                                    className="absolute right-1 inline-block text-black dark:text-black hover:bg-gray-100 dark:hover:bg-gray-700 bg-white rounded-lg text-sm px-1.5 py-0.5"
                                    type="button"
                                >
                                    <span className="sr-only">Open dropdown</span>
                                    <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 3">
                                        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
                                    </svg>
                                </button>
                            }
                            className="top-8 right-0"
                        >
                            {/*Dropdown menu*/}
                            <div className={`z-10 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow min-w-44 w-max dark:bg-gray-700`}>
                                <ul className="py-2">
                                    <li>
                                        <button
                                            type='button'
                                            disabled={isLoading}
                                            onClick={() => handleRemoveInstructorFromCourse({ instructor_id: instructor?.instructor_id as string, course_slug })}
                                            className="disabled:cursor-not-allowed disabled:opacity-90 w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                        >
                                            <IoRemoveCircleOutline size={20} /> <span>Revoke access</span> {isLoading && <span className='loading-spinner !border-gray-400 !border-t-primary !w-3 !h-3 animate-spinner'></span>}
                                        </button>
                                    </li>
                                    <li>
                                        <button className="flex items-center w-full gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">
                                            <MdEditNote size={20} /> <span>Edit</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </Dropdown>
                    </div>
                }
            </div>
            <p className='text-base font-semibold dark:text-white'>{`${instructor.username}`}</p>
            <div className='flex justify-between items-center'>
                <p className='font-medium text-sm text-gray-400'>{instructor.profession}</p>
                <p className={`${instructor.role === "Presenter" ? "text-green-500" : "text-sky-500"} text-sm font-semibold`}>{instructor.role}</p>
            </div>
        </div>
    )
}

export default InstructorCard