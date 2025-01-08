
import dynamic from 'next/dynamic';
import { cookies } from 'next/headers';
import PageControls from '../_components/page-parts/instructorsListPage/PageControls';
import InstructorsData from '../_components/page-parts/instructorsListPage/InstructorsData';
import { getInstructorsData } from '@/lib/fetch/instructors/get-instructors';
import AlertBox from '@/components/Common/AlertBox';

const Header = dynamic(() => import('../_components/page-parts/instructorsListPage/Header'), { ssr: false })
const AddInstructorModal = dynamic(() => import('../_components/modals/AddInstructorModal'))


const InstructorsPage = async () => {
    const token = (cookies()?.get("access_token")?.value as string) ?? "";

    const allInstructorsData = await getInstructorsData({ token });

    return (
        <div>
            <Header />
            {allInstructorsData?.data?.total !== 0 ?
                <>
                    <PageControls />

                    <InstructorsData prefetchedData={allInstructorsData} />
                </>
                :
                <AlertBox type='error' message='No Instructors found' />
            }

            <AddInstructorModal />
        </div>
    )
}

export default InstructorsPage