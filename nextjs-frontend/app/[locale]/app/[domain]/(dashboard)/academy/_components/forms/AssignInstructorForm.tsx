"use client"

import { useToast } from '@/components/ui/toast/use-toast';
import { fetchAssignInstructor } from '@/lib/fetch/courses/FetchCourses';
import { InstructorType } from '@/lib/types/dataTypes';
import { useSingleCourseStore } from '@/stores/useCourseStore';
import { useModalStore } from '@/stores/useModalsStore';
import { useInstructorsStore } from "@/stores/useWSStore";
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useSWRConfig } from 'swr';

const AssignInstructorForm = ({ setModalOpen }: { setModalOpen: (value: boolean) => void }) => {

    const {course_slug, assigned_instructors} = useSingleCourseStore();
    const { all_instructors } = useInstructorsStore();
    const { setModalOpenState } = useModalStore();

    const { toast } = useToast();
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);
    const [formValue, setFormValue] = useState({
        instructor_id: "",
        role: "Editor"
    });

    const availableInstructors = useMemo(() => {
        return all_instructors?.filter((el: InstructorType) => !assigned_instructors.some(inst => el.instructor_id === inst.instructor_id));

    }, [all_instructors, assigned_instructors])

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    };

    const handleSubmit = async (instructor: InstructorType) => {
        try {
            setIsLoading(true);
            const response = await fetchAssignInstructor({ instructor, course_slug });

            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: response.message });
                    setModalOpen(false);
                    mutate(process.env.NEXT_PUBLIC_COURSES_API_URL + `/v1/courses/get/${course_slug}`)
                } else {
                    toast({ variant: "destructive", description: response.message });
                }
                setIsLoading(false);
            }
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
            console.error(error);
        }
    }

    return (
        <div className='pt-8 pb-2 px-3 flex flex-col justify-center gap-4'>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(formValue)
                }}
            >
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="instructor_id" className="block mb-3 text-sm font-semibold text-gray-900">
                        Instructor Name
                    </label>
                    <select
                        id="instructor_id"
                        name="instructor_id"
                        defaultValue={""}
                        onChange={handleSelectChange}
                        className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 mb-3 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                        <option value="">Select Instructor</option>
                        {availableInstructors && availableInstructors?.map((instructor: InstructorType) => (
                            <option key={instructor.instructor_id} value={instructor.instructor_id}>{instructor.instructor_name}</option>
                        ))
                        }
                    </select>
                </div>
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="role" className="block mb-3 text-sm font-semibold text-gray-900">
                        Select Instructor Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        onChange={handleSelectChange}
                        defaultValue={"Editor"}
                        className="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    >
                        <option value="Editor">Editor</option>
                        <option value="Presenter">Presenter</option>
                    </select>
                </div>
                <div className='mt-4'>
                    <p className='w-full text-center text-gray-500 my-4'>
                        Can&apos;t find instructor ! Add it to the workspace <Link href={"/academy/instructors"} onClick={() => setModalOpenState(true)} className='font-semibold text-black'>click here</Link>
                    </p>
                    <div className='flex items-center justify-start md:justify-end mt-7 md:mt-0'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex items-center gap-2 bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Assign {isLoading && <span className='loading-spinner animate-spinner'></span>}
                        </button>
                    </div>
                </div>
            </form>

        </div>
    )
}

export default AssignInstructorForm