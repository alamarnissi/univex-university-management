"use client"
import Image from 'next/image';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import useSWR, { SWRConfig, useSWRConfig } from 'swr';

import CourseCurriculum from '../_components/courseTabs/courseCurriculum/CourseCurriculum';

import { SingleCourseData } from '@/lib/data/dummyDataCourses';
import { InstructorType, ModuleDataType, StudentType } from '@/lib/types/dataTypes';

import { fetchChangeCourseStatus, fetchSingleCourse } from '@/lib/fetch/courses/FetchCourses';
import { useSingleCourseStore } from '@/stores/useCourseStore';
import { usePathname } from 'next/navigation';

import { useInstructorsStore } from '@/stores/useWSStore';
import { instructorTabNavs, managerTabNavs } from '@/lib/data/data';
import SingleCourseSkeleton from '@/components/skeletons/SingleCourseSkeleton';
import { MdOutlinePaid } from 'react-icons/md';
import { BsArrowUpRightSquare } from 'react-icons/bs';
import { FaCalendarCheck, FaShareAlt } from 'react-icons/fa';

import PreviewIcon from '../_components/courseTabs/courseCurriculum/icons/PreviewIcon';
import FillStar from '@/components/Common/assets/FillStar';
import OutlineStar from '@/components/Common/assets/OutlineStar';
import UsersIcon from '@/components/Common/assets/UsersIcon';
import { useToast } from '@/components/ui/toast/use-toast';
import { cn } from '@/lib/utils';

const CourseInstructors = dynamic(() => import('../_components/courseTabs/CourseInstructors'), { ssr: false } );
const CourseStudents = dynamic(() => import('../_components/courseTabs/CourseStudents'), { ssr: false } );
const CourseReviews = dynamic(() => import('../_components/courseTabs/CourseReviews'), { ssr: false } );
const CourseSettings = dynamic(() => import('../_components/courseTabs/CourseSettings'), { ssr: false } );

const ShareCourseModal = dynamic(() => import('../_components/modals/ShareCourseModal'), { ssr: false } );
const ScheduleCourseModal = dynamic(() => import('../_components/modals/ScheduleCourseModal'), { ssr: false } );

const SearchBar = dynamic(() => import('../_components/SearchBar'), { ssr: false } );

type TabNavProp = {
    title: string,
    href: string,
    order: number
}

const SingleCoursePage = ({ role, subdomain, slug, prefetchedData, allInstructors }: { role: string, subdomain:string, slug: string, prefetchedData: any, allInstructors: InstructorType[] }) => {
    const apiSingleCourse_url = process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${slug}`;

    const {
        setWorkspaceID,
        setWorkspaceSubdomain,
        setCourseID,
        setCourseSlug,
        setCurriculumType,
        setSchedules,
        setAssignedInstructors,
        setCourseModules
    } = useSingleCourseStore();
    const { setAllInstructors } = useInstructorsStore();

    const { toast } = useToast();
    const { mutate } = useSWRConfig();
    const pathname = usePathname();
    const [openTab, setOpenTab] = useState(1);
    const [isScheduled, setIsScheduled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [openShareModal, setOpenShareModal] = useState(false);
    const [openScheduleModal, setOpenScheduleModal] = useState(false);
    const { image } = SingleCourseData;

    const tabsNavs: TabNavProp[] = role === "manager" ? managerTabNavs : role === "instructor" ? instructorTabNavs : [];

    const { data: courseData } = useSWR(
        apiSingleCourse_url,
        fetchSingleCourse,
        {
            fallbackData: prefetchedData,
            onSuccess: (data) => {
                setWorkspaceID(data?.data?.workspace_id);
                setWorkspaceSubdomain(subdomain);
                setCourseID(data?.data?.course_id);
                setCourseSlug(data?.data?.slug);
                setCurriculumType(data?.data?.curriculum_type);
                setAssignedInstructors(data?.data?.assigned_instructors);
                setCourseModules(data?.data?.modules);
                setAllInstructors(allInstructors);
                setSchedules(data?.data?.schedules);
                data?.data?.schedules.length !== 0 ? setIsScheduled(true) : setIsScheduled(false);
            }
        }
    )
    const courseDetails = courseData?.data;
    const imagePreview = `${process.env.NEXT_PUBLIC_GCS_URL}${process.env.NEXT_PUBLIC_GCS_BUCKET_NAME}/${courseDetails?.promotional_image}`

    const reviewsScore = () => {
        const reviews = courseDetails?.overall_rating;
        if (reviews && reviews >= 0) return Number((reviews).toFixed())
        return 0;
    }

    const renderStars = () => {
        const stars = [];
        const score = reviewsScore();

        for (let i = 0; i < 5; i++) {
            if (i < score) {
                stars.push(<FillStar key={i} />);
            } else {
                stars.push(<OutlineStar key={i} />);
            }
        }

        return stars;
    };

    const handleStatusButtonColor = (status: string, role: string) => {
        switch (role) {
            case "manager":
                if (status === "published") return "bg-red-400 hover:bg-red-400/90";
                if (status === "draft") return "bg-green-400 hover:bg-green-400/90";
                if (status === "in-review") return "bg-green-400 hover:bg-green-400/90";
                break;
            case "instructor":
                if (status === "in-review") return "bg-red-400 hover:bg-red-400/90";
                if (status === "draft") return "bg-orange-400 hover:bg-orange-400/90";
                if (status === "published") return "pointer-events-none cursor-not-allowed bg-green-400 hover:bg-green-400/90";
                break;
            default:
                break;
        }
    }

    const handleChangeStatus = async ({ role, course_slug, course_status }: { role: string, course_slug: string, course_status: string }) => {
        try {
            setIsLoading(true);
            let status = "";
            if (role === "manager") {
                status = course_status === "published" ? "draft" : "published";
            } else if (role === "instructor") {
                status = course_status === "draft" ? "in-review" : "draft";
            }
            const response = await fetchChangeCourseStatus(course_slug, status);

            if (response.status >= 200 && response.status < 300) {
                toast({ variant: "success", description: response.message });
            } else {
                toast({ variant: "destructive", description: response.message });
            }
            mutate(apiSingleCourse_url)
            setIsLoading(false);
            return true;
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            return false;
        }
    }

    if (!courseDetails) return <><SingleCourseSkeleton /></>

    return (
        <>
            <SWRConfig value={prefetchedData}>
                <div className={`flex flex-col items-center justify-between gap-8`}>
                    {/* First Part */}
                    <div className='grid grid-cols-1 md:grid-cols-4 gap-5 w-full'>
                        <div className='col-span-1 md:col-span-3 grid grid-cols-1 md:grid-cols-3 shadow-md rounded-xl bg-white dark:!bg-navy-800 dark:text-white cursor-pointer gap-4 py-3 px-4'>
                            <div className="relative col-span-1 w-full min-h-[168px] h-fit m-auto">
                                <Image
                                    src={courseDetails?.promotional_image !== "" ? imagePreview! : image!}
                                    className="rounded-xl"
                                    alt={courseDetails?.course_name! as string}
                                    fill
                                    sizes="(min-width: 768px) 50vw, 100vw"
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div className='col-span-1 md:col-span-2 flex flex-col items-start gap-3 px-2 text-black dark:text-black'>
                                <h6 className='text-lg font-semibold dark:text-white'>{courseDetails?.course_name}</h6>
                                <p className='text-sm font-medium dark:text-white min-h-[100px] h-max'>
                                    {/* {courseDetails?.course_description.length > 240 ? `${courseDetails?.course_description.slice(0, 240)}...` : courseDetails?.course_description} */}
                                    {courseDetails?.course_description}
                                </p>
                                <div className='grid auto-cols-max grid-cols-2 md:grid-cols-2 gap-y-2 gap-x-5'>
                                    <div className='flex items-start gap-3 ml-1 text-start dark:text-white'>
                                        <p className='font-semibold text-sm'>{reviewsScore()}</p>
                                        <div className="flex items-center gap-0.5">
                                            {renderStars()}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3 text-start dark:text-white'>
                                        <UsersIcon />
                                        <p className='font-semibold text-sm'>{courseDetails?.number_of_students} Participants</p>
                                    </div>
                                    <div className='flex items-center gap-3 text-start dark:text-white'>
                                        <MdOutlinePaid />
                                        <p className='font-semibold text-sm'>{courseDetails?.course_access} Course</p>
                                    </div>
                                    <div className='flex items-center gap-3 text-start dark:text-white'>
                                        <p className={cn('font-semibold text-sm',
                                            courseDetails?.course_status === "published" ? "text-green-400" : courseDetails?.course_status === "draft" ? "text-red-400" : "text-orange-400"
                                        )}>Status: {courseDetails?.course_status}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-span-1 my-auto'>
                            <div className='flex flex-col w-full gap-4 justify-center'>
                                {
                                    // Show schedul button only for Cohort-based courses
                                    courseDetails?.course_type !== "self-paced" &&
                                    <button
                                        onClick={() => setOpenScheduleModal(true)}
                                        className='flex gap-3 rounded-lg px-5 py-3 shadow-lg text-white dark:text-white bg-pink-400 hover:bg-pink-400/90'
                                    >
                                        <FaCalendarCheck />
                                        <p className='text-sm font-medium capitalize'>
                                            {isScheduled ? "Reschedule Course" : "Schedule Course"}
                                        </p>
                                    </button>
                                }
                                <button
                                    onClick={() => setOpenShareModal(true)}
                                    className='flex gap-3 rounded-lg px-5 py-3 shadow-lg text-white dark:text-white bg-blue-400 hover:bg-blue-400/90'
                                >
                                    <FaShareAlt />
                                    <p className='text-sm font-medium capitalize'>Share Course</p>
                                </button>
                                <button
                                    onClick={() => handleChangeStatus({ role, course_slug: slug, course_status: courseDetails?.course_status })}
                                    disabled={isLoading}
                                    className={cn(`disabled:cursor-not-allowed disabled:opacity-90 flex gap-3 rounded-lg px-5 py-3 shadow-lg text-white dark:text-white `,
                                        handleStatusButtonColor(courseDetails?.course_status, role),
                                    )}
                                >
                                    <BsArrowUpRightSquare />
                                    <p className='flex items-center gap-2 text-sm font-medium capitalize'>
                                        {
                                            {
                                                "manager": courseDetails?.course_status === "published" ? "Unpublish Course" : "Publish Course",
                                                "instructor": courseDetails?.course_status === "draft" ? "Change status: In-review" : courseDetails?.course_status === "in-review" ? "Change status: Draft" : "Status: Published",
                                            }[role]
                                        }

                                    </p>
                                    {isLoading && <span className='loading-spinner animate-spinner'></span>}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs Topbar */}
                    <div className="flex flex-wrap w-full">
                        <div className="w-full">
                            <div className='grid grid-cols-1 md:grid-cols-2 md:grid-flow-col bg-white dark:!bg-navy-800 dark:text-white rounded-xl shadow-md px-4 py-3 mb-4'>
                                <ul
                                    className="order-2 md:order-1 col-span-2 flex mb-0 list-none flex-nowrap md:flex-wrap overflow-x-scroll md:overflow-x-auto py-3 flex-row"
                                    role="tablist"
                                >
                                    {tabsNavs && tabsNavs.map((el) => (
                                        <li key={el.order} className="-mb-px mr-2 px-3 last:mr-0 text-center">
                                            <a
                                                className={
                                                    "relative text-sm font-bold rounded leading-normal " +
                                                    (openTab === el.order
                                                        ? "text-primary"
                                                        : "text-gray-600")
                                                }
                                                onClick={e => {
                                                    e.preventDefault();
                                                    setOpenTab(el.order);
                                                }}
                                                data-toggle="tab"
                                                href={el.href}
                                                role="tablist"
                                            >
                                                {el.title}
                                                <span className={`${openTab === el.order ? `bg-primary block` : `hidden`} absolute -bottom-1 left-0 h-0.5 w-1/3`}></span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                <div className='flex items-center justify-center gap-3 order-1 md:order-2 mb-2 md:mb-0'>
                                    {role && <SearchBar bgColor='bg-gray-100' placeholder='Find a module or lesson ...' />}
                                    {role === "instructor" &&
                                        <PreviewIcon />
                                    }
                                </div>
                            </div>
                            <div className="relative flex flex-col min-w-0 break-words bg-white dark:!bg-navy-800 dark:text-white w-full mb-6 shadow-lg rounded">
                                <div className="px-6 pt-5 pb-8 flex-auto">
                                    <div className="tab-content tab-space">
                                        <div className={openTab === 1 ? "block" : "hidden"} id="curriculum">
                                            <CourseCurriculum course_slug={slug} course_id={courseDetails?.course_id} modules={courseDetails?.modules as ModuleDataType[]} nbrModules={courseDetails?.total_modules_number} />
                                        </div>
                                        <div className={openTab === 2 ? "block" : "hidden"} id="instructors">
                                            <CourseInstructors
                                                instructors={courseDetails?.assigned_instructors as InstructorType[]}
                                                course_slug={slug}
                                                role={role}
                                            />
                                        </div>
                                        <div className={openTab === 3 ? "block" : "hidden"} id="students">
                                            <CourseStudents
                                                students={courseDetails?.students as StudentType[]}
                                                role={role}
                                            />
                                        </div>
                                        <div className={openTab === 4 ? "block" : "hidden"} id="reviews">
                                            <CourseReviews />
                                        </div>
                                        <div className={openTab === 5 ? "block" : "hidden"} id="settings">
                                            {courseDetails && <CourseSettings course={courseDetails} slug={slug} />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </SWRConfig>
            <ShareCourseModal link={pathname} modalOpen={openShareModal} setModalOpen={setOpenShareModal} />
            <ScheduleCourseModal modalOpen={openScheduleModal} isScheduled={isScheduled} setModalOpen={setOpenScheduleModal} />
        </>
    )
}

export default SingleCoursePage