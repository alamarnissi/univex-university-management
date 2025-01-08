"use client"
import ListSkeleton from '@/components/skeletons/ListSkeleton';
import { useToast } from '@/components/ui/toast/use-toast';
import { fetchWSInstrcutors } from '@/lib/fetch/FetchInstructors';
import { useControlsStore } from '@/stores/useGlobalStore';
import { useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

// images
import InstructorsWorkspaceTable from '../../InstructorsWorkspaceTable';



const InstructorsData = ({ prefetchedData }: { prefetchedData: any }) => {
    const fetchUrl = process.env.NEXT_PUBLIC_AUTH_API_URL + "/v1/instructors/list";

    const {
        sortValue,
        searchValue
    } = useControlsStore();

    const { data: instructorsData } = useSWR(
        [fetchUrl, sortValue, searchValue],
        ([fetchUrl, sortValue, searchValue]) => fetchWSInstrcutors(fetchUrl, sortValue, searchValue),
        { fallbackData: prefetchedData }
    );
    const instructors = instructorsData?.data?.instructors || [];

    return (
        <div>
            {!instructors ?
                <div className='w-full flex flex-col justify-center gap-3'>
                    <ListSkeleton />
                    <ListSkeleton />
                    <ListSkeleton />
                </div>

                :
                <InstructorsWorkspaceTable instructors={instructors} total={instructorsData?.data?.total} />
            }
        </div>
    )
}

export default InstructorsData