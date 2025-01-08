"use client"
import useSWR, { SWRConfig } from 'swr';

import { fetchSingleCourse } from '@/lib/fetch/courses/FetchCourses';
import { useSingleCourseStore } from '@/stores/useCourseStore';

import StudentSingleCourseSkeleton from '@/components/skeletons/StudentSingleCourseSkeleton';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRight, ChevronRightIcon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { XpIcon } from '@/components/Common/assets/XpIcon';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { BsCircleFill } from 'react-icons/bs';
import { NoteCard } from '../_components/NoteCard';


const StudentSingleCoursePage = ({ role, slug, prefetchedData }: { role: string, slug: string, prefetchedData: any }) => {
    const apiSingleCourse_url = process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${slug}`;

    const {
        setWorkspaceID,
        setCourseID,
        setCourseSlug,
        setCurriculumType,
        setSchedules,
        setAssignedInstructors,
        setCourseModules,
    } = useSingleCourseStore();

    const [openTakeNote, setOpenTakeNote] = useState(false);

    const { data: courseData } = useSWR(
        apiSingleCourse_url,
        fetchSingleCourse,
        {
            fallbackData: prefetchedData,
            onSuccess: (data) => {
                setWorkspaceID(data?.data?.workspace_id);
                setCourseID(data?.data?.course_id);
                setCourseSlug(slug);
                setCurriculumType(data?.data?.curriculum_type);
                setAssignedInstructors(data?.data?.assigned_instructors);
                setCourseModules(data?.data?.modules);
                setSchedules(data?.data?.schedules);
            }
        }
    )
    const courseDetails = courseData?.data;

    if (!courseDetails) return <StudentSingleCourseSkeleton />

    return (
        <>
            <SWRConfig value={prefetchedData}>
                <div className='relative flex justify-normal items-center w-full h-full gap-5'>
                    <div className={`${openTakeNote ? 'xl:mr-[320px]' : ''} w-full h-full flex flex-col items-center justify-between gap-8`}>
                        <div className='w-full flex flex-col md:flex-row items-start md:items-center justify-between px-1'>
                            <p className='font-bold text-2xl py-2'>
                                { courseDetails?.course_name }
                            </p>
                            <Button
                                className='primary-action-btn font-semibold dark:text-white'
                                onClick={() => setOpenTakeNote(!openTakeNote)}
                            >
                                Take Notes
                            </Button>
                        </div>

                        <div className='w-full bg-white rounded-xl flex flex-col justify-center gap-8 py-8 px-5'>
                            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-3'>
                                <p className='order-1 text-base font-semibold capitalize text-navy-700 dark:text-white'>
                                    Module 1
                                </p>
                                <div className='order-3 md:order-2 w-full md:w-2/5 flex items-center justify-center gap-3 mt-2'>
                                    <ChevronLeftIcon size={18} className='cursor-pointer' />
                                    <div className='relative w-full flex flex-col items-center gap-1 text-right'>
                                        <p className='absolute right-0 bottom-3 text-xs font-semibold text-[#71E9AF]'>
                                            40%
                                        </p>
                                        <Progress value={40} className='h-2 !bg-gray-100' style={{ backgroundColor: "#71E9AF" }} />
                                    </div>
                                    <ChevronRightIcon size={18} className='cursor-pointer' />
                                </div>
                                <div className='order-2 md:order-3 flex justify-start items-center md:justify-center gap-2'>
                                    <XpIcon />
                                    <p className='text-sm font-semibold text-[#D9186C]'>
                                        10 XP
                                    </p>
                                </div>
                            </div>

                            <div className='w-full'>
                                <iframe src="https://iframe.mediadelivery.net/embed/239280/0e1a5d4e-4a60-4b70-b0ca-4a48fe11c5da" loading='lazy' allowFullScreen allow='accelerometer; gyroscope; encrypted-media; picture-in-picture;' className='w-full h-auto min-h-[300px] md:h-[450px] rounded-lg'></iframe>
                            </div>
                        </div>

                    </div>
                    <div className={`${openTakeNote ? "flex flex-col gap-4" : "hidden"} w-[300px] min-h-full absolute transition-all ease-linear duration-150 -right-5 bottom-0 z-10 bg-white rounded-l-lg`}>
                        <div className='flex items-center justify-between p-3'>
                            
                            <Button
                                onClick={() => setOpenTakeNote(false)}
                                className='flex items-center justify-center w-5 h-5 px-0 rounded-full bg-navy-700 '
                            >
                                <ChevronRight size={17} className="text-white" />
                            </Button>
                            
                            <p className='text-center font-semibold'>
                                Take notes 👋
                            </p>
                            <div className='cursor-pointer flex items-center justify-center w-8 h-8 rounded-full bg-primary text-white hover:bg-primary/90'>
                                <Plus size={18} />
                            </div>
                        </div>
                        <div className='flex items-start justify-center w-full'>
                            <div className='flex flex-col items-center justify-center gap-4 px-3 pt-4 w-full'>
                                <NoteCard bgColor='bg-green-400/80' />
                            </div>
                            <div className='flex flex-col justify-start gap-3 w-[30px]'>
                                <BsCircleFill size={16} className='text-green-500 cursor-pointer' />
                                <BsCircleFill size={16} className='text-orange-500 cursor-pointer' />
                                <BsCircleFill size={16} className='text-red-500 cursor-pointer' />
                                <BsCircleFill size={16} className='text-blue-500 cursor-pointer' />
                                <BsCircleFill size={16} className='text-purple-500 cursor-pointer' />
                            </div>
                        </div>
                    </div>
                </div>
            </SWRConfig>
        </>
    )
}

export default StudentSingleCoursePage