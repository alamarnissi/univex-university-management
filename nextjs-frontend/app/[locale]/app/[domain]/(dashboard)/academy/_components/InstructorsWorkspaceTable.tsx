import { InstructorType } from '@/lib/types/dataTypes'
import Image from 'next/image'
import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from '@/components/ui/alert-dialog';

import userImg from "@/components/Common/assets/user.png"
import { BsTrash } from 'react-icons/bs'
import AlertBox from '@/components/Common/AlertBox';
import { useToast } from '@/components/ui/toast/use-toast';
import { useSWRConfig } from 'swr';
import { fetchDeleteInstructor } from '@/lib/fetch/FetchInstructors';
import { useControlsStore } from '@/stores/useGlobalStore';
import { setFormattedDate } from '@/lib/hooks/setFormattedDate';

const InstructorsWorkspaceTable = ({ instructors, total }: { instructors: InstructorType[], total: number }) => {
    const fetchUrl = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/instructors/list";

    const {
        sortValue,
        searchValue
    } = useControlsStore();

    const [isLoading, setIsLoading] = useState(false);
    const [deletingInstructorId, setDeletingInstructorId] = useState("");

    const { toast } = useToast();
    const { mutate } = useSWRConfig();
    
    const handleDelete = async (instructor_id: string) => {
        try {
            setIsLoading(true);
            setDeletingInstructorId(instructor_id);
            const response = await fetchDeleteInstructor({ instructor_id });

            if (response) {
                if (response.status >= 200 && response.status < 300) {
                    toast({ variant: "success", description: response.message });
                } else {
                    toast({ variant: "destructive", description: response.message });
                }
                mutate([fetchUrl, sortValue, searchValue]);
                setIsLoading(false)
            }
        } catch (error) {
            setIsLoading(false);
            toast({ variant: "destructive", description: "An Error Has Occurred" });
        }
    }

  return (
    <div className="mb-6 w-full md:overflow-auto overflow-scroll">
            <table className='w-full'>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-navy-700 border-b dark:text-white">
                    <tr>
                        <th scope="col" className="px-4 py-3">Name</th>
                        <th scope="col" className="px-4 py-3">Email</th>
                        <th scope="col" className="px-4 py-3">Enrolled Courses</th>
                        <th scope="col" className="px-4 py-3">Last Seen</th>
                        <th scope="col" className="px-4 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {instructors && instructors.map(data => (
                        <tr className="border-b dark:border-gray-700" key={data.instructor_id}>
                            <th scope="row" className="pl-8 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="z-10 -mr-3 h-10 w-10 relative rounded-full border-2 border-white dark:!border-navy-800"
                                    >
                                        <Image
                                            className="h-full w-full rounded-full object-cover dark:contrast-0"
                                            src={userImg}
                                            alt="instructor"
                                            fill
                                        />
                                    </div>
                                    <div className="flex flex-col items-start gap-1 ml-1">
                                        <p className="text-sm font-semibold dark:text-white">
                                            {data.instructor_name}{" "}
                                        </p>
                                    </div>
                                </div>
                            </th>
                            <td className="pl-8 py-3 dark:text-white">{data.email}</td>
                            <td className="pl-8 py-3 dark:text-white text-center">{data?.workspaces && data.workspaces.map((el: any) => {
                                return el.workspace_id === data.workspace_id && el.courses.length
                            }) }</td>
                            <td className="px-4 py-3 text-center dark:text-white">{data.last_login !== null ? setFormattedDate(new Date(data.last_login as string)) : "No Login Yet"}</td>
                            <td className="flex items-center justify-center px-4 py-3 text-center cursor-pointer">
                                    {!isLoading ? (
                                        // If not loading, show trash icon for all instructors
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
                                                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot be undone. This will permanently delete the selected instructor!
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction
                                                            onClick={() => { handleDelete(data.instructor_id as string) }}
                                                            className="bg-red-500 hover:bg-red-600 text-white"
                                                        >
                                                            Continue
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </div>
                                    ) : (
                                        // If loading, check if it's the instructor being deleted
                                        data.instructor_id === deletingInstructorId ? (
                                            // Show spinner for the instructor being deleted
                                            <span className='loading-spinner animate-spinner !border-red-500 !border-t-white'></span>
                                        ) : (
                                            // Show trash icon for other instructors
                                            <button disabled={isLoading} className='disabled:cursor-not-allowed disabled:opacity-90 flex justify-center items-center gap-4 rounded-xl border border-red-800 text-red-800 px-6 py-3 hover:border-red-800/90 hover:text-red-800/90'>
                                                <BsTrash size={20}  />
                                            </button>
                                        )
                                    )}
                            </td>
                        </tr>
                    ))
                    }

                </tbody>
            </table>
            {total === 0 &&
                <AlertBox type='error' message='No instructors found' />
            }
        </div>
  )
}

export default InstructorsWorkspaceTable