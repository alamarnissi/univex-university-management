import { useToast } from '@/components/ui/toast/use-toast';
import { fetchAssignStudent } from '@/lib/fetch/courses/FetchCourses';
import { StudentType } from '@/lib/types/dataTypes';
import { useSingleCourseStore } from '@/stores/useCourseStore';
import { useState } from 'react';
import { useSWRConfig } from 'swr';


const AssignStudentForm = ({ setModalOpen }: { setModalOpen: (value: boolean) => void }) => {
    const { course_slug } = useSingleCourseStore();

    const { toast } = useToast();
    const { mutate } = useSWRConfig()
    const [isLoading, setIsLoading] = useState(false);
    const [formValue, setFormValue] = useState({
        student_name: "",
        email: ""
    });

    const {student_name, email} = formValue

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.currentTarget;
        setFormValue((prevState) => {
            return {
                ...prevState,
                [name]: value,
            };
        });
    }

    const handleSubmit = async (student: StudentType) => {
        try {
            setIsLoading(true);
            const response = await fetchAssignStudent({ student, course_slug });

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
                <div className='self-stretch pr-0 md:pr-5 leading mb-3'>
                    <label htmlFor="student_name" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Student Name
                    </label>
                    <input
                        type="text"
                        name="student_name"
                        id="student_name"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="John Doe"
                        value={student_name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='self-stretch pr-0 md:pr-5 leading'>
                    <label htmlFor="email" className="block mb-3 text-sm font-semibold text-gray-900 dark:text-black">
                        Adresse Email
                    </label>
                    <input
                        type="text"
                        name="email"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        placeholder="name@example.com"
                        value={email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className='mt-4'>
                    <div className='flex items-center justify-start md:justify-end mt-7 md:mt-0'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="disabled:cursor-not-allowed disabled:opacity-90 text-white inline-flex gap-3 items-center bg-primary hover:bg-primary/90 focus:ring-4 focus:outline-none focus:ring-primary-300 font-semibold rounded-lg text-base px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Add {isLoading && <span className='loading-spinner animate-spinner'></span>}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default AssignStudentForm