"use client"
import Image from 'next/image'
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useControlsStore } from '@/stores/useGlobalStore';
import { useToast } from '@/components/ui/toast/use-toast';
import { fetchWSStudents } from '@/lib/fetch/FetchStudents';
import ListSkeleton from '@/components/skeletons/ListSkeleton';
import AlertBox from '@/components/Common/AlertBox';
import { StudentType } from '@/lib/types/dataTypes';
import { BsTrash } from 'react-icons/bs'
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

// images
import instructorImg from "@/components/Common/assets/instructor1.png"
import StudentsWorkspaceTable from '../../StudentsWorkspaceTable';


const StudentsList = ({ prefetchedData }: { prefetchedData: any }) => {
    const fetchUrl = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/students/list";

    const {
        sortValue,
        searchValue
    } = useControlsStore();

    const { toast } = useToast();
    const { mutate } = useSWRConfig();
    const [isLoading, setIsLoading] = useState(false);

    const { data: studentsData } = useSWR(
        [fetchUrl, sortValue, searchValue],
        ([fetchUrl, sortValue, searchValue]) => fetchWSStudents(fetchUrl, sortValue, searchValue),
        { fallbackData: prefetchedData }
    );
    const students = studentsData?.data?.students || [];

    return (
        <div>
            {!students ?
                <div className='w-full flex flex-col justify-center gap-3'>
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                </div>

                :
                <StudentsWorkspaceTable students={students} />
            }
        </div>
    )
}

export default StudentsList