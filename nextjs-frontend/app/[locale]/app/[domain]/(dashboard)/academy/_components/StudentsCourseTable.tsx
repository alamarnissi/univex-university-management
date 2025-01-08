import Image from 'next/image'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { StudentType } from '@/lib/types/dataTypes'
import { fetchRemoveStudentFromCourse } from '@/lib/fetch/courses/FetchCourses'
import { useSingleCourseStore } from '@/stores/useCourseStore'
import { useToast } from '@/components/ui/toast/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { BsTrash } from 'react-icons/bs'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

// images
import userImg from "@/components/Common/assets/user.png"


const StudentsCourseTable = ({ students, setModalOpen, role }: { students: StudentType[], setModalOpen: (value: boolean) => void, role: string }) => {
    const { course_slug } = useSingleCourseStore();

    const { toast } = useToast();
    const { mutate } = useSWRConfig();

    const [isLoading, setIsLoading] = useState(false);
    const [deletingStudentEmail, setDeletingStudentEmail] = useState("");

    const handleDeleteStudentFromCourse = async ({ student }: { student: StudentType }) => {
        try {
            setIsLoading(true);
            setDeletingStudentEmail(student?.email as string)
            const response = await fetchRemoveStudentFromCourse({ student, course_slug });

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
        <div className="mb-6 w-full md:overflow-auto overflow-scroll">
            <table className='w-full'>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-navy-700 border-b dark:text-white">
                    <tr>
                        <th scope="col" className="px-4 pl-5py-3 text-start">Name</th>
                        <th scope="col" className="px-4 py-3 text-start">Email</th>
                        <th scope="col" className="px-4 py-3 text-start">Last Acccess To The Course</th>
                        {role === "manager" &&
                            <th scope="col" className="px-4 py-3">
                                <button
                                    className="primary-action-btn"
                                    onClick={() => { setModalOpen(true) }}
                                >
                                    + Add Student
                                </button>

                            </th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {students?.length >= 1 ? students.map(data => (
                        <tr className="border-b dark:border-gray-700" key={data.student_id}>
                            <th scope="row" className="pl-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="z-10 -mr-3 h-10 w-10 relative rounded-full border-2 border-white dark:!border-navy-800"
                                    >
                                        <Image
                                            className="h-full w-full rounded-full object-cover"
                                            src={userImg}
                                            alt="student"
                                            fill
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-1 ml-1">
                                        <p className="text-sm font-semibold dark:text-white">
                                            {data.student_name}{" "}
                                        </p>
                                    </div>
                                </div>
                            </th>
                            <td className=" py-3 dark:text-white">{data.email}</td>
                            <td className="px-4 py-3 text-center dark:text-white">{data.last_login}</td>
                            {role === "manager" &&
                                <td className="flex items-center justify-center px-4 py-3 text-center cursor-pointer">
                                    {!isLoading ? (
                                        // If not loading, show trash icon for all students
                                        <div className='text-center'>
                                            <AlertDialog>
                                                <AlertDialogTrigger
                                                    disabled={isLoading}
                                                    className='disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-4 rounded-xl border border-red-800 text-red-800 px-6 py-3 hover:border-red-800/90 hover:text-red-800/90'
                                                >
                                                    <BsTrash size={20} />
                                                    {isLoading && <span className='loading-spinner !border-gray-400 !border-t-primary !w-3 !h-3 animate-spinner'></span>}
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Unassign Student From This Course?</AlertDialogTitle>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => { handleDeleteStudentFromCourse({ student: { email: data.email } }) }}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    ) : (
                                        // If loading, check if it's the student being deleted
                                        data.email === deletingStudentEmail ? (
                                            // Show spinner for the student being deleted
                                            <span className='loading-spinner animate-spinner !border-red-500 !border-t-white'></span>
                                        ) : (
                                            // Show trash icon for other students
                                            <button disabled={isLoading} className='disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-4 rounded-xl border border-red-800 text-red-800 px-6 py-3 hover:border-red-800/90 hover:text-red-800/90'>
                                                <BsTrash size={20} />
                                            </button>
                                        )
                                    )}
                                </td>
                            }
                        </tr>
                    ))
                        : null
                    }

                </tbody>
            </table>
            {students?.length === 0 &&
                <Alert variant="destructive" className='!min-w-[400px] mt-4'>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className='font-medium'>
                        No Students assigned to this course
                    </AlertDescription>
                </Alert>
            }
        </div>
    )
}

export default StudentsCourseTable