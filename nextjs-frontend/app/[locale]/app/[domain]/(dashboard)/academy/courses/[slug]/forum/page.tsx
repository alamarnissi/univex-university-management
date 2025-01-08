"use client"

import Image from 'next/image'
import { useEffect } from 'react'
import { useSingleCourseStore } from '@/stores/useCourseStore'

import SearchBar from '../../../_components/SearchBar'
import { useModalStore } from '@/stores/useModalsStore'
import { Plus } from 'lucide-react'
import { BsArrowUpRightSquare } from 'react-icons/bs'
import { RiMessage2Fill, RiMessage2Line, RiThumbUpFill, RiThumbUpLine } from 'react-icons/ri'

import Forum from "@/components/Common/assets/Forum.png"
import userImg from "@/components/Common/assets/user.png"
import AskQuestionModal from './_components/AskQuestionModal'

const ForumPage = ({ params: { slug } }: { params: { slug: string } }) => {
    const { setCourseSlug } = useSingleCourseStore()
    const { modalOpenState, setModalOpenState } = useModalStore()

    useEffect(() => {
        setCourseSlug(slug)
    }, [])

    return (
        <>
            <div className='w-full flex items-center justify-center gap-2 bg-white border border-[#6C63FFB5] rounded-lg px-5 py-4'>
                <Image
                    src={Forum}
                    alt="forum"
                    width={60}
                    height={60}
                />
                <div className='text-center px-4'>
                    <p className='font-semibold text-lg'>
                        Welcome to the forum! Connect with your peers, ask questions and share insights
                    </p>
                </div>
            </div>

            <div className='flex flex-col justify-center gap-4 bg-white px-6 py-8 rounded-lg mt-5'>
                <div className='flex items-center justify-between'>
                    <SearchBar bgColor='bg-gray-100' />
                    <div className='flex items-center justify-start gap-3 md:justify-end mt-7 md:mt-0'>
                        <button
                            onClick={() => setModalOpenState(true)}
                            className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex justify-center gap-2 items-center bg-primary hover:bg-primary/90 focus:outline-none font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary dark:hover:bg-parimary/90"
                        >
                            <Plus size={16} className='text-white' /> Ask Question
                        </button>
                    </div>
                </div>

                <div className='flex flex-col justify-center gap-6 mt-8 p-5 pb-0 shadow-md'>
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
                                4 hours ago
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className='font-semibold mb-2'>
                            File not found Error in reading text in python
                        </p>

                        <p>
                            A <span className='underline text-orange-400'>paragraph</span> to explain his question
                        </p>
                    </div>

                    <div className='w-full px-1 flex items-center gap-4'>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            Python
                        </div>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            Error
                        </div>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            File
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-start gap-8 pl-2'>
                        <div className='flex items-center justify-center gap-2 hover:cursor-pointer'>
                            <RiThumbUpFill size={20} className="text-primary" />
                            <span className='text-gray-700'>30</span>
                        </div>
                        <div className='flex items-center justify-center gap-2 hover:cursor-pointer'>
                            <RiMessage2Fill size={20} className="text-primary" />
                            <span className='text-gray-700'>12 Comments</span>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 border-t border-b border-gray-200 py-4'>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <RiThumbUpLine size={20} />
                            <span>Like</span>
                        </div>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <RiMessage2Line size={20} />
                            <span>Respond</span>
                        </div>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <BsArrowUpRightSquare size={20} />
                            <span>Share</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col justify-center gap-6 p-5 pb-0 shadow-md'>
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
                                Sledge Hammer{" "}
                            </p>
                            <p className='text-gray-400 text-sm dark:text-gray-700'>
                                2 days ago
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className='font-semibold mb-2'>
                            File not found Error in reading text in python
                        </p>

                        <p>
                            A <span className='underline text-orange-400'>paragraph</span> to explain his question
                        </p>
                    </div>

                    <div className='w-full px-1 flex items-center gap-4'>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            Python
                        </div>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            Error
                        </div>
                        <div className='w-fit rounded-xl bg-gray-100 capitalize text-sm font-medium text-center px-4 py-2'>
                            File
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-start gap-8 pl-2'>
                        <div className='flex items-center justify-center gap-2 hover:cursor-pointer'>
                            <RiThumbUpFill size={20} className="text-primary" />
                            <span className='text-gray-700'>30</span>
                        </div>
                        <div className='flex items-center justify-center gap-2 hover:cursor-pointer'>
                            <RiMessage2Fill size={20} className="text-primary" />
                            <span className='text-gray-700'>12 Comments</span>
                        </div>
                    </div>

                    <div className='grid grid-cols-3 border-t border-b border-gray-200 py-4'>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <RiThumbUpLine size={20} />
                            <span>Like</span>
                        </div>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <RiMessage2Line size={20} />
                            <span>Respond</span>
                        </div>
                        <div className='flex items-center justify-center gap-3 text-gray-600 hover:cursor-pointer hover:text-gray-700'>
                            <BsArrowUpRightSquare size={20} />
                            <span>Share</span>
                        </div>
                    </div>
                </div>
            </div>
            {modalOpenState && <AskQuestionModal />}
        </>
    )
}

export default ForumPage